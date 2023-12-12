import json
from pathlib import Path
import logging
import numpy as np
import pandas as pd

# IVA-Defects spreadsheet needs to exist in working directory. Change below to match actual file name.
EXCEL_FILE = "CVS Approvals Required Standards Taxonomy for Development - Master Copy.xlsx"

EXPECTED_COLUMNS = ["Section Number", "Section Description", "RS Number", "Required Standard", "Ref Calculation",
                    "Additional info", "Basic", "Normal"]
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)


class CustomEncoder(json.JSONEncoder):
    """
    Custom encoder for writing to JSON to allow for numpy values
    """

    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        elif pd.isna(obj):
            return None
        return super().default(obj)


def remove_unnamed_columns(df):
    """
     Remove columns starting called unnamed from a dataframe
    """
    cols_to_drop = [col for col in df.columns if col.startswith('Unnamed')]
    return df.drop(columns=cols_to_drop)


def stringify(value):
    """
    Convert values to a format based on column name
    """
    return str(value) if not pd.isna(value) else ""


def prepare_section_json(categoryData, eu_vehicle_category):
    """
    Prepare a JSON representation of a section in the taxonomy.
    """
    required_standards = []
    for _, row in categoryData.iterrows():
        isBasicTest = True if row['Basic'] else False
        isNormalTest = True if row['Normal'] else False
        required_standard = {
            "rsNumber": stringify(row['RS Number']),
            "requiredStandard": stringify(row['Required Standard']),
            "refCalculation": stringify(row['Ref Calculation']),
            "additionalInfo": row['Additional info'],
            "basicInspection": isBasicTest,
            "normalInspection": isNormalTest
        }
        required_standards.append(required_standard)

    section_data = {
        "euVehicleCategory": eu_vehicle_category.lower(),
        "sectionNumber": stringify(categoryData['Section Number'].iloc[0]),
        "sectionDescription": stringify(categoryData['Section Description'].iloc[0]),
        "requiredStandards": required_standards
    }
    return section_data


def transform_dataframe(df):
    """
    Apply data transformations to the dataframe prior to dumping to JSON
    """
    df = remove_unnamed_columns(df)
    missing_cols = [col for col in EXPECTED_COLUMNS if col not in df.columns]
    for col in missing_cols:
        df[col] = None

    df['Ref Calculation'] = df['Ref Calculation'].apply(stringify)
    df[["Basic", "Normal", "Additional info"]] = df[["Basic", "Normal", "Additional info"]].map(
        lambda x: x.lower() if isinstance(x, str) else x).replace({'yes': True, 'no': False}).fillna(False)
    return df


def dumpJSON(xls, output_dir):
    """
    The processing function reads each sheet from an excel file, applies data transformations,
    and generates the json objects based on the provided manual
    """
    sheet_json_content = []
    for sheet_name in xls.sheet_names:
        try:
            df = pd.read_excel(xls, skiprows=[0], sheet_name=sheet_name,
                               dtype={"Ref Calculation": str, "Section Number": str, "RS Number": str}).dropna(
                axis=1, how='all')

            df = transform_dataframe(df)

            sheet_json_content.extend([prepare_section_json(group, sheet_name)
                                       for _, group in df.groupby(['Section Number', 'Section Description'])])

        except Exception as e:
            logging.error(f"Failed to process sheet {sheet_name}: {e}", exc_info=True)
            raise

    try:
        with open(Path(output_dir) / "iva-defects.json", 'w', encoding='utf-8') as f:
            json.dump(sheet_json_content, f, indent=4, cls=CustomEncoder, ensure_ascii=False)

    except Exception as e:
        logging.error(f"Failed to write to json file: {e}", exc_info=True)
        raise


def process_excel_file(file_path: str, output_dir: str, max_workers: int = 5) -> None:
    """
    Process an excel file and generate json file
    """
    try:
        dumpJSON(pd.ExcelFile(file_path), output_dir)
    except Exception as e:
        logging.error(f"Error processing sheet: {e}", exc_info=True)

    logging.info("JSON files generated in the output directory.")


if __name__ == "__main__":
    out_dir = '../tests/resources'
    try:
        process_excel_file(EXCEL_FILE, out_dir)
    except Exception as e:
        logging.error(f"Error: {e}", exc_info=True)
