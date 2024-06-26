/* Table Filter 

   These functions allow a user to filter a table on any data in the non-sub-header 
   rows of the tbody section of the table by simply typing into an input box, and 
   to clear the filter with the click of a button to restore all rows of the table. 

   The code assumes that subheader rows within the tbody section of the table are 
   classed with either "subhead" or "subsubhead". Those rows are left alone so that 
   users can see the context for the rows that match the filter. The row(s) in the 
   thead of the table are also left alone so any header rows always appear. 

 
   The following HTML should be added just above the table: 

    <input type="text" id="table-filter-input" onkeyup="tableFilter()" placeholder="Filter table..." /> 

   <button id="table-filter-button" onclick="clearFilterInput()">Clear filter</button> 

 
   The CSS should target the following ids to style the input box, the button, and 
   the button in the hover state, respectively: 

      #table-filter-input 
      #table-filter-button 
      #table-filter-button:hover 
*/ 

function tableFilter() { 
  var input, filter, table, tbody, tr, i, td, j, txtValue; 
  input = document.getElementById("table-filter-input"); 
  filter = input.value.toUpperCase(); 
  table = document.getElementById("filtered-table"); 
  tbody = table.getElementsByTagName("thead")[0]; 
  tr = tbody.getElementsByTagName("tr"); 
 
  // Loop through all table rows, then through all row cells, 
  // and hide the rows where none of the cells match the filter 
  for (i = 0; i < tr.length; i++) { 
    if (!(tr[i].classList.contains("basic") || 
          tr[i].classList.contains("subhead2"))) { 
      tr[i].style.display = "none"; 
      td = tr[i].getElementsByTagName("td"); 
      for (j = 0; j < td.length; j++) { 
        if (td[j]) { 
          txtValue = td[j].textContent || td[j].innerText; 
          if (txtValue.toUpperCase().indexOf(filter) > -1) { 
            tr[i].style.display = ""; 
          } 
        } 
      } 
    } 
  } 
} 

function clearFilterInput() { 
  var input = document.getElementById("table-filter-input"); 
  input.value = ""; 
  tableFilter(); // force the table to reset since there is no keyup action here 
} 