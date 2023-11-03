Feature: IVA M1 defectTaxonomy

Background: Generate valid token
Given A token is generated for authorization

Scenario Outline: Return no defects for M1 taxonomy when endpoint is invalid
        When I hit the M1 taxonomy "<endpoint>"
        Then status code should be <statuscode>
        And should return no defects

        Examples:
        |endpoint             |statuscode|
        |defects/invalid      |200       |
        |defects/iva/invalid  |200       |