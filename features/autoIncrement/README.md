Feature: autoIncrement
======================

Enable this test in `package.json` with: `"features": ["autoIncrement"]`

When autoIncrement is set to true on an attribute and no value is provided for it a new unique value 
will be assigned by the adapter before the record is created. It is guaranteed that the adapter will 
assign a unique value not present on any existing record. The values assigned automatically will not 
necessarily be sequential, which accommodates the use of UUIDs. If a value for the attribute is 
present in the data provided for a new record it will be saved as-is without any guarantee of uniqueness. 
The autoIncrement option has no effect when updating existing records.

Usage on Waterline models:

```
attributes: {
  id: {
    type: "integer", // or "string"
    autoIncrement: true
  }
}
```

## Sub-Features

### autoIncrement.sequential

Enable this test in `package.json` with: `"features": ["autoIncrement.sequential"]`

If the adapter will provide sequential unique values, for example increasing integers, then it is 
further guaranteed that the next value will be the last saved value plus one increment. If a value 
is provided and is larger than the current auto-inc counter the counter will be bumped to the 
provided value. If a provided value is less than or equal to the auto-inc counter value the 
counter will remain unchanged, and again there will be no guaranteed that this value is unique. 

This sub-feature is a special case/implementation detail of the `autoIncrement` attribute by 
selected adapters and is not configured explicitly.  
