$(document).ready(function(){

$.ajax({
    url: '/submit-order',
    type: 'POST',
    data: $('form').serialize(),
    success: function(){
      M.toast({html: 'Заказ успешно совершен!'});
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.error(textStatus, errorThrown);
    }
  });
  
})