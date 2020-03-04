
var ROOT_CONTROLLER = "";

$(document).ready(function () { 
    ROOT_CONTROLLER = $("#HID_CONTROLLER_ROOT").val() || "/Receiving";

    SpaForm.Init();
    vuePage.GetDropdowns();
    vuePage.GetDashboardValues();

    setInterval(function () { vuePage.GetDashboardValues(); }, 1000000);
});

var vuePage = new Vue({
    el: '#vuePage',
    data: {
        IsLoading: false, DashboardValu: {},
        PageTask: { IsList: false, IsAdd: false, IsAddBulk: false, IsEdit: false },
        model: {}, modelEdit: {}, modelBulk: {}, modelView: {}, modelDetail: {},
        LIST_RECORD: [], LIST_BULK: [], LIST_DROPDOWN: [] 
    },

    methods: {
        //------SPA PAGEVIEW---------
        ResetTaskView: function (fxn) {
            PageLoading.Show();
            setTimeout(function () {
                vuePage.PageTask = { IsList: false, IsAdd: false, IsAddBulk: false, IsEdit: false };
                fxn();  PageLoading.Hide();
            }, 40);
        },
        CreateView: function () {     this.ResetTaskView(function () {  vuePage.PageTask.IsAdd = true;   }); },
        BulkUploadView: function () { this.ResetTaskView(function () {  vuePage.PageTask.IsAddBulk = true;  });  },
        EditView: function (row) {    this.ResetTaskView(function () {  vuePage.PageTask.IsEdit = true;  vuePage.modelEdit = row;  });  },
        ListView: function () {       this.ResetTaskView(function () {  vuePage.PageTask.IsList = true;   vuePage.GetReceiving();  });   },
        //>>>>>SPA END PAGEVIEW 
                
        GetDropdowns: function () {
            PageLoading.Show();    /*Id,Name,GroupName*/
            SpaAjax.Post(ROOT_CONTROLLER+"/GetDropdowns", {}, function (result) {  vuePage.LIST_DROPDOWN = result || [];  });
        },

        GetDashboardValues: function () {  
            SpaAjax.Post(ROOT_CONTROLLER+"/DashboardValues", {}, function (result) {  vuePage.DashboardValu = result || {}; });
        },

        GetModelRecord: function (id) {
            PageLoading.Show();
            SpaAjax.Get(ROOT_CONTROLLER+"/Detail", { id: id}, function (result) { vuePage.modelEdit = result || {}; }, function (err) { SwalAlert.Danger("Unknown Record, Try Again"); });
        },
              
        SearchRecords: function () {
             let FkCompany = $.trim($("#v_FkCompany").val() || ""); 
 let FkWarehouse = $.trim($("#v_FkWarehouse").val() || ""); 
 let FkSupplier = $.trim($("#v_FkSupplier").val() || ""); 

            let fromDate = $.trim($("#v_FromDate").val() || "");
            let toDate = $.trim($("#v_ToDate").val() || "");  

            PageLoading.Show();  
            SpaAjax.Post(ROOT_CONTROLLER+"/SearchRecords", { search: {}, fromDate: fromDate, toDate: toDate }, function (result) {
                vuePage.LIST_RECORD = result || [];    SpaForm.VueDataTable("#tbl-receiving", vuePage);
            });        
        },

        ShowDetail: function (obj) {  this.modelDetail = Object.assign({}, obj);  $("#modal-detail").modal();   },

        DeleteRecord: function (row) {
            let ids = [];
            if (row == null) {
                //Checked Boxes, Delete Multiple Records
                ids = SpaForm.GetCheckedIDs(".chklist");
            } else {
                // Delete only one record
                ids.push(row.Id);
            }

            if (ids.length == 0) {
                SwalAlert.Info("Please select at least a record to delete...");
                return;
            }

            SwalAlert.Confirm("Confirm Delete", "Are you sure you want to delete?", function (result) {
                PageLoading.Show();
                SpaAjax.Post(ROOT_CONTROLLER+"/DeleteRecords", { ids: ids }, function (result) {
                    //Remove Deleted Records
                    $.each(ids, function (ind, objId) {   
                        vuePage.LIST_RECORD = vuePage.LIST_RECORD.filter(function (el) { return el.Id != objId; });
                    });
                    SpaForm.VueDataTable("#tbl-receiving", vuePage);

                    vuePage.IsLoading = false;
                    SwalAlert.Success("Delete process completed...");
                }, function (err) { vuePage.IsLoading = false; });
            });

        },

        SaveNewRecord: function () {    
            this.IsLoading = true;
            if (!FormValidator.IsFormValid('#formNewRecord')) {
                this.IsLoading = false;   return false;
            }

            PageLoading.Show();
            SpaAjax.Post(ROOT_CONTROLLER+"/AddReceiving", { model: this.model }, function (result) {
                if (result.IsSuccess) {
                    vuePage.model = null;    SwalAlert.Success(result.Message);
                } else {
                    SwalAlert.Danger(result.Message);
                }
                vuePage.IsLoading = false;
            },  function (err) {  vuePage.IsLoading = false;   });
        },

        UpdateRecord: function () {  
            this.IsLoading = true;
            if (!FormValidator.IsFormValid('#formEditRecord')) {
                this.IsLoading = false;    return false;
            }

            PageLoading.Show();
            SpaAjax.Post(ROOT_CONTROLLER+"/EditReceiving", { model: this.modelEdit }, function (result) {   
                if (result.IsSuccess) {
                    vuePage.modelEdit = {};   vuePage.ListView();   SwalAlert.Success(result.Message);
                } else {
                    SwalAlert.Danger(result.Message);
                }
                vuePage.IsLoading = false;
            },   function (err) {  vuePage.IsLoading = false; });
        },
		
        RemoveBulkItem: function (row) {   
            PageLoading.Show();
            setTimeout(function () {
                vuePage.LIST_BULK = vuePage.LIST_BULK.filter(function (el) { return el.Id != row.Id; });
                SpaForm.VueDataTable("#tblbulk-receiving", vuePage);   PageLoading.Hide();
            }, 30);
        },
        
        SaveBulkupload: function () {
            PageLoading.Show();
            SpaAjax.Post(ROOT_CONTROLLER+"/SaveBulkupload", { model: this.LIST_BULK }, function (result) {
                vuePage.LIST_BULK = [];   
                if (result.IsSuccess) {    
                    SwalAlert.Success(result.Message);
                } else {
                    //Show the objects and the errors
                    var listBulk = [];
                    $.each(result.Result, function (ind, obj) {
                        let errMSG = JSON.parse(obj.JsonObject);   errMSG.ErrorMessage = obj.Message;
                        listBulk.push(errMSG);
                    });

                    vuePage.LIST_BULK = listBulk; 
                    SpaForm.VueDataTable("#tblbulk-receiving", vuePage);
                    SwalAlert.Danger(result.Message);
                }
            }, function (err) { vuePage.IsLoading = false; });
        }
    }
});


function PreviewBulkupload(data) {
	PageLoading.Show();
    SpaAjax.Post(ROOT_CONTROLLER+"/PreviewUpload", { filename: data.TempName }, function (result) { 
        ClearBulkupload();  vuePage.LIST_BULK = result || [];    SpaForm.VueDataTable("#tblbulk-receiving", vuePage);    
    }, function (err) { vuePage.IsLoading = false; });
}

function ClearBulkupload() {  $("#divPreviewBulkupload").html("");  $("#hidBulkupload,#inputBulkupload").val("");   vuePage.LIST_BULK = [];  }
        