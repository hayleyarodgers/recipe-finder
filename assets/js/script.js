// Spoonacular Api Call - fetchs results

var getRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2&apiKey=39791063581a4d96a908bb19745b3f64'
fetch(getRecipe).then((data)=>{
   console.log(data);
});



function fn1()
{
   var ingred = document.getElementById('form1').value;
   var ingred2 = document.getElementById('form2').value;
   var ingred3 = document.getElementById('form3').value;
   var allIngreds = ingred + ",+" + ingred2 + ",+" + ingred3;

   console.log (allIngreds);

   var newRecipe = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients='+ allIngreds + '&number=10&apiKey=39791063581a4d96a908bb19745b3f64';
 
   console.log(newRecipe);

   var inputs = document.querySelectorAll('#form1, #form2, #form3')

   inputs.forEach(input => {
      input.value = '';
   });
};

