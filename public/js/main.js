
  $().ready(function(){
    $("#detail").validate({
      rules: {
        name: {
          required:true,
          minlength:2
        },
        email: {
          required: true,
          email: true
        },
        tel: {
          number: true
        }
      }
    });
  });
