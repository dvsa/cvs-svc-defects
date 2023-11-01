import concurrent.futures
import json
import re
from pathlib import Path
import logging
from typing import Union, List, Any, Dict

import numpy as np
import pandas as pd
from flatten_json import flatten

EXPECTED_COLUMNS = ["RS Number", "Required Standard", "Ref Calculation", "Additional info", "Basic", "Normal"]
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        elif pd.isna(obj):
            return None
        return super().default(obj)


def keys_to_lower_camel_case(data: Union[Dict, List]) -> Union[Dict, List]:
    if isinstance(data, dict):
        return {convert_key_to_camel_case(k): keys_to_lower_camel_case(v) for k, v in data.items()}
    if isinstance(data, list):
        return [keys_to_lower_camel_case(item) for item in data]
    return data


def convert_key_to_camel_case(key: str) -> str:
    return re.sub(r'[\s_]+', '', key.title()).replace(' ', '') or key


def parse_category_keys(category_key: str) -> List[str]:
    delimiters = ' ', '-', ','
    regex_pattern = '|'.join(map(re.escape, delimiters))
    return re.split(regex_pattern, category_key)


def generate_process_function(sheet_name, category_map):
    def process(xls, output_dir):
        try:
            df = pd.read_excel(xls, sheet_name=sheet_name, skiprows=[0]).dropna(axis=1, how='all')
            vehicle_type = category_map.get(sheet_name, "Unknown")

            df = remove_unnamed_columns(df)
            missing_cols = [col for col in EXPECTED_COLUMNS if col not in df.columns]
            for col in missing_cols:
                df[col] = None

            df['Ref Calculation'] = df['Ref Calculation'].apply(stringify)
            df[["Basic", "Normal", "Additional info"]] = df[["Basic", "Normal", "Additional info"]].map(
                lambda x: x.lower() if isinstance(x, str) else x).replace({'yes': True, 'no': False}).fillna(False)

            if sheet_name in ["M2 M3", "N2 N3"]:
                categories = sheet_name.split()
            elif sheet_name == "O1-O4":
                categories = [f"O{i}" for i in range(1, 5)]
            else:
                categories = [sheet_name]

            for category in categories:
                json_filename = f"{category}.json"
                json_flattened_filename = f"{category}_flattened.json"

                sheet_json_content = [
                    prepare_section_json(group, vehicle_type, category)
                    for _, group in df.groupby(['Section Number', 'Section Description'])
                ]

                with open(Path(output_dir) / json_filename, 'w', encoding='utf-8') as f:
                    json.dump(sheet_json_content, f, indent=4, cls=CustomEncoder, ensure_ascii=False)

                with open(Path(output_dir) / json_flattened_filename, 'w', encoding='utf-8') as f:
                    flat_data = [flatten(item, separator='_') for item in sheet_json_content]
                    json.dump(flat_data, f, indent=4, cls=CustomEncoder, ensure_ascii=False)

        except Exception as e:
            logging.error(f"Failed to process sheet {sheet_name}: {e}", exc_info=True)
            raise

    return process


def process_excel_file(file_path: str, output_dir: str, category_map: Dict[str, str], max_workers: int = 5) -> None:
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        processes = [generate_process_function(sheet_name, category_map) for sheet_name in category_map.keys()]
        futures = [executor.submit(process, pd.ExcelFile(file_path), output_dir) for process in processes]

        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as e:
                logging.error(f"Error processing sheet: {e}", exc_info=True)

    logging.info("JSON files generated in the output directory.")


def remove_unnamed_columns(df: pd.DataFrame) -> pd.DataFrame:
    cols_to_drop = [col for col in df.columns if col.startswith('Unnamed')]
    return df.drop(columns=cols_to_drop)


def stringify(value):
    return str(value) if not pd.isna(value) else ""


def prepare_section_json(group: pd.DataFrame, vehicle_type: str, eu_vehicle_category: str) -> Dict[str, Any]:
    required_standards = []
    for _, row in group.iterrows():
        inspection_types = []
        if row['Basic']:
            inspection_types.append("basic")
        if row['Normal']:
            inspection_types.append("normal")

        required_standard = {
            "rsNumber": row['RS Number'],
            "requiredStandard": row['Required Standard'],
            "refCalculation": row['Ref Calculation'],
            "additionalInfo": row['Additional info'],
            "inspectionTypes": inspection_types
        }
        required_standards.append(required_standard)

    section_data = {
        "sectionNumber": group['Section Number'].iloc[0],
        "sectionDescription": group['Section Description'].iloc[0],
        "vehicleTypes": [vehicle_type],
        "euVehicleCategories": [eu_vehicle_category],
        "requiredStandards": required_standards
    }
    return section_data


if __name__ == "__main__":
    excel_file = 'CVS Approvals Defect Taxonomy - Master Copy 1101023.xlsx'
    out_dir = 'output_json'
    cat_map = {
        "M1": "Cars",
        "M2 M3": "Buses and Coaches",
        "N1": "Vans and LGV",
        "N2 N3": "HGV",
        "O1-O4": "Trailers",
        "MSVA": "Motorcycle"
    }

    try:
        process_excel_file(excel_file, out_dir, cat_map)
    except Exception as e:
        logging.error(f"Error: {e}", exc_info=True)
