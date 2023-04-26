import { Autocomplete, Box, Chip, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel,
    MenuItem, OutlinedInput, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material';
 import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

const OptionsHeader = ({events, filters, handleOpenCreateForm, handleFilter, setEventInfo, slotDuration, setSlotDuration}) => {
    const theme = useTheme();

     /* Set category options on the search bar */
    const categoryOptions = Object.values(events.data).sort((a, b) => {
      let result;
      if (a.extendedProps.category > b.extendedProps.category){
        result = -1;
      } else {
        if (a.extendedProps.category < b.extendedProps.category){
            result = 1;
        } else {
            if (a.title > b.title) {
              result = 1
            } else {
              if (a.title < b.title) {
                  result = -1
              }
            }
        }
      }
      return result;
    });

    /* Menu filter */ 
    const filtersList = ['Obligatoire', 'Vie', 'Santé'];
    //styles
    function getStyles(filter, filtersList, theme) {
        return {
        fontWeight:
            filters.indexOf(filter) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
        };
    }  

    return ( 
        <>
        <div className='mui-forms'>
          <Stack spacing={2} sx={{ ml: 25, width: 300 }}>
          <Autocomplete
            id="search-by-category"
            options={categoryOptions}
            groupBy={(option) => option.extendedProps.category}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300 }}
            onChange={(e, value) => {
              setEventInfo(value);
              handleOpenCreateForm()
            }}
            renderInput={(params) => <TextField {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            label="Search by category" />}
          />
          </Stack>
          <FormControl sx={{ mt: 2, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Filter</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={filters}
              onChange={handleFilter}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >            
              {filtersList.map((filter) => (
                <MenuItem
                  key={filter}
                  value={filter}
                  style={getStyles(filter, filtersList, theme)}
                >
                  {filter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <FormControl>
            <FormLabel id="slot-duration-select">Slot Duration</FormLabel>
            <RadioGroup
              aria-labelledby="slot-duration-select-options"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              name="slot-duration-select-options"
              sx={{ display: "block" }}
            >
              <FormControlLabel
                value="00:15:00"
                control={<Radio size="small" />}
                label="15min"
              />
              <FormControlLabel
                value="00:30:00"
                control={<Radio size="small" />}
                label="30min"
              />
              <FormControlLabel
                value="01:00:00"
                control={<Radio size="small" />}
                label="1h"
              />
            </RadioGroup>
          </FormControl>
        </>

     );
}
 
export default OptionsHeader;