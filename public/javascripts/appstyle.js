$(".comments").on("click" , "a", function(){
	$(this).siblings(".edit").toggleClass("visible"); //this will select the siblings with class "edit"
	$(this).toggleClass("visible");
});