/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
   
     /* button  .uib_w_3 */
    
        /* button  .uib_w_3 */
    
        /* button  #btn-logout */
    
        /* button  #btn-scan */
    $(document).on("click", "#btn-scan", function(evt)
    {    
        //navigator.notification.alert(localStorage.getItem("Website"));
        var result = null;
        /* your code goes here */ 
        //intel.xdk.device.scanBarcode();
        cordova.plugins.barcodeScanner.scan(
          function (result) {
              
              $("#txt-barcode").val(result.text);
              knowthyequipment(result.text);
              getstatus();

          }, 
          function (error) {
              navigator.notification.alert("Scanning failed: " + error);
          }
        );
    });
    
        /* button  #btn-logout */
    $(document).on("click", "#btn-logout", function(evt)
    {
        /* your code goes here */ 
        //document.addEventListener("navigator.notification.confirm", confirm_logout, false);
        
        function confirm_logout(e)
        {
            //e.id represents the id of the confirm box
            if(e === 1)
            {
                localStorage.removeItem("User_id");
                localStorage.removeItem("username");
                localStorage.removeItem("secret");
                //first button clicked.
                navigator.notification.alert("pressed logout");
                activate_page("#mainpage"); 

            }
            else
            {
                //second button clicked
                 navigator.notification.alert("pressed cancel");
            }
            
            
        }
        
        navigator.notification.confirm("This is the message",confirm_logout, "This is the title", ['logout','Cancel']);
        
    });
     
     
    
        /* button  #btn-setting */
    $(document).on("click", "#btn-setting", function(evt)
    {
         /*global activate_page */
        if(localStorage.getItem("Website"))
            $('#txt-domain').val(localStorage.getItem("Website"));
         activate_page("#settingpage"); 
    });
    
        /* button  #btn-connect */
    $(document).on("click", "#btn-connect", function(evt)
    {
        /* your code goes here */ 
        

//        console.log($('#txt-domain').val());
//         navigator.notification.alert($('#txt-domain').val(), 'Error', 'Ok');
        if($('txt-domain').val() === null){
            navigator.notification.alert("Domain required!", 'Okay',"Connection Error");
            $('#btn-connect').removeClass('btn-success btn-primary').addClass('btn-danger');
        }
        else{
            $.post(
                testdomain($('#txt-domain').val()),
                "",
                function(response) {
                    if(response==="1"){
                        navigator.notification.alert("Connection Established!!", 'Ok','Success');
                        localStorage.setItem("Website", $('#txt-domain').val());
                        console.log(localStorage.getItem("Website"));
                        $('#btn-connect').removeClass('btn-danger btn-primary').addClass('btn-success');
                    }
                    else if(response === null)
                        navigator.notification.alert("No response", 'Okay',"Connection Error");
                    else
                       navigator.notification.alert("Response is: "+ response, 'Okay',"Unknown Server Response"); 
                }
            ).fail(
                function( jqxhr, textStatus, error)
                {
                    navigator.notification.alert("Error sending data to server",'Ok', 'Error');
                    $('#btn-connect').removeClass('btn-success btn-primary').addClass('btn btn-danger');
                }
            );
        }
        
        
    });
    
        /* button  #btn-backsetting */
    
    
        /* button  #btn-submit */
    $(document).on("click", "#btn-submit", function(evt)
    {
        var usage;
        if(document.getElementById("rdo-start").checked===true){
            usage = "addusage";}
        else if(document.getElementById("rdo-end").checked===true){
            usage = "updateusage";}
        /* your code goes here */ 
        var data = {"equipmentID":$("#txt-equipmentid").val(),"status":$("#txt-equipmentstatus").val(),"remarks":$("#txtarea-remarks").val(),"user_id":localStorage.getItem("User_id")};
        $.post(
            connect_to(usage),
            {'data':JSON.stringify(data)},
            function( response ) {
                //response = $.parseJSON(response);
                navigator.notification.alert("Data Sent!", 'Success', 'Ok');
                console.log(response);
                clearfields();
            }
        ).fail(
            function( jqxhr, textStatus, error)
            {
                navigator.notification.alert("Error sending data to server : " + error, 'Ok', textStatus);
            }
        );
        
        //navigator.notification.alert($("#txt-equipmentstatus").val());
    });
    
        /* button  #btn-setting-login */
    $(document).on("click", "#btn-setting-login", function(evt)
    {
         /*global activate_page */
        if(localStorage.getItem("Website"))
            $('#txt-domain').val(localStorage.getItem("Website"));
         activate_page("#settingpage"); 
        
    });
    
        /* button  #btn-backsetting */
    $(document).on("click", "#btn-backsetting", function(evt)
    {
         /*global activate_page */
         activate_page("#mainpage"); 
    });
    
        /* button  #btn--login */
    $(document).on("click", "#btn-login", function(evt)
    {
        
        if(localStorage.getItem("Website")){
            
        
        /* your code goes here */ 
        
        var data = {"username":$('#txt-username').val(),"pw":$('#txt-password').val()};
        $.post(
            connect_to_temp(),
            {'data':JSON.stringify(data)},
            function( response ) {
                //alert(response);
                 response = $.parseJSON(response);
                if(response.result){
                    localStorage.setItem('User_id',response.message);
                    localStorage.setItem('username',$('#txt-username').val());
                    localStorage.setItem('secret',$('#txt-password').val());
                    $('#txt-username').val(null);
                    $('#txt-password').val(null);
                    activate_page("#formpage");
                }
                else{
                    console.log(response);
                    navigator.notification.alert(response.message, 'Okay',"Authentication Error");
                }
                
               
            }
        ).fail(
            function( jqxhr, textStatus, error)
            {
                navigator.notification.alert(error, 'Error', 'Ok');
            }
        );
        
        }
        else{
             navigator.notification.alert("Set Connection First!", 'Error', 'Ok');
        }
                   
    });

    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();

function testdomain(tempdomain){
    var url = "http://" + tempdomain + "/ulims-resource-management/equipment/restequipments/connectionTest";
    return url;
}

function connect_to(actioncall){
    var url = "http://" + localStorage.getItem("Website") + "/ulims-resource-management/equipment/restequipments/" + actioncall;
    return url;
}

function connect_to_temp(){
    var url = "http://" + localStorage.getItem("Website") + "/ulims-resource-management/equipment/restequipments/";
    return url;
}

function knowthyequipment(result){
    //the data will send for querying
    var data = {"barcode":result,"username":localStorage.getItem('username'),"pw":localStorage.getItem('secret')};
    $.post(
        connect_to("getEquipment"),
        {'data':JSON.stringify(data)},
        function( response ) {
            
            try {
                response = $.parseJSON(response);
                navigator.notification.alert(response.name, 'Okay',"Equipment Found!");
                $("#txt-equipmentname").val(response.name);
                $("#txt-equipmentid").val(response.equipmentID);
                $("#txt-equipmentstatus").val(response.status);
                getusagestatus(response.equipmentID);
            }
            catch(err) {
                navigator.notification.alert(response, 'Error', 'Ok');
            }
           
        }
    ).fail(
        function( jqxhr, textStatus, error)
        {
            navigator.notification.alert("Error sending data to server " + textStatus, 'Error', 'Ok');
        }
    );
}

function getstatus(){
//    var data = {"username":localStorage.getItem('username'),"pw":localStorage.getItem('secret')};
//    $.post(
//        connect_to("getstatus"),
//        {'data':JSON.stringify(data)},
//        function( response ) {
//            if(response){
//                response = JSON.Encode(response);
//               
//                setOptions('#txt-equipmentstatus', response, 'ID', 'name');
//                navigator.notification.alert(response,"okay","Error");
//            }
//            else{
//                navigator.notification.alert("Error getting equipment statuses","okay","Error");
//            }
//        }
//    ).fail(
//        function( jqxhr, textStatus, error)
//        {
//            errorAlert( error, textStatus );
//        }
//    );
    
    
    $.getJSON(
        connect_to("getstatus"),
        function( response )
        {
           // navigator.notification.alert(response,"okay","Error");
            setOptions('#txt-equipmentstatus', response, 'ID', 'name');
        }
    ).fail(
        function( jqxhr, textStatus, error )
        {
            console.log(textStatus + error +jqxhr);
           // errorAlert( error, textStatus );
        }
    );
}

function setOptions(selector, array_data, value_attribute, text_attribute)
{
    $(selector).html('');
    $.each(array_data, function( index, obj ) {
        $(selector).append(
            $('<option></option>').val(obj[value_attribute]).html(obj[text_attribute])
        );
    });
}

function errorAlert( error_msg, title )
{
    navigator.notification.beep(2);
    navigator.notification.vibrate(250);
    navigator.notification.alert( error_msg, title );
}

function getusagestatus(id){
    var data = {"id":id,"username":localStorage.getItem('username'),"pw":localStorage.getItem('secret')};
    $.post(
        connect_to("getusage"),
        {'data':JSON.stringify(data)},
        function( response ) {
           
            
            if(response==="0"){
                console.log("no usage");
                //document.getElementById("red").checked = true;
                document.getElementById("rdo-end").checked = false;
                document.getElementById("rdo-start").checked = true;
            }
            else if(response==="1"){
                //$('#rdo-end').checked = true;
                console.log("has usage");
                document.getElementById("rdo-start").checked = false;
                document.getElementById("rdo-end").checked = true;
                //document.getElementById("rdo-end").checked = true;
            }
            else
                console.log("unknown response "+response);
        }
    ).fail(
        function( jqxhr, textStatus, error)
        {
            navigator.notification.alert("Error getting the usage status", 'Error', 'Ok');
        }
    );
}

function clearfields(){
    $('#txt-barcode').val(null);
    $('#txt-equipmentid').val(null);
    $('#txt-equipmentname').val(null);
    //$('#txt-equipmentstatus').val()="";
    document.getElementById("rdo-end").checked = false;
    document.getElementById("rdo-start").checked = false;
}

//function composejson(rawdata){
//    var tobedata = 
//}
