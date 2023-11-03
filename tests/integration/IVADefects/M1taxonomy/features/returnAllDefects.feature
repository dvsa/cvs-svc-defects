Feature: IVA M1 defectTaxonomy

Background: Generate valid token
Given A token is generated for authorization

Scenario Outline: Return all the defects for M1 taxonomy
        When I hit the M1 taxonomy "<endpoint>"
        Then status code should be <statuscode>
        And should return all defects in the database

        Examples:
        |endpoint            |statuscode|
        |defects/iva         |200       |
        |defects/iva/manual  |200       |