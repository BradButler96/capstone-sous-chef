// Add ingredient input to search by ingredient form
let ingredientCount = 0;
let ingredientsArray = []

function removeIngredient() {
    const ingredientName = $(this).prev().text();
    $(`#ingredient-${ingredientName}-span`).remove()
    ingredientsArray = ingredientsArray.filter((ingredient) => {return ingredient != ingredientName})
    updateRecipes(ingredientsArray)
}

function addIngredient() {
    const ingredient = $('#ingredient_0').val()
    ingredientsArray.push(ingredient)

    $('#added-ingredients-div').append($('<span>').attr('class', 'ingredient-list badge rounded-pill bg-light')
                                                  .attr('id', `ingredient-${ingredient}-span`));

    $(`#ingredient-${ingredient}-span`).append($('<p>').text(ingredient)
                                                            .attr('class', 'ingredient-name')
                                                            .attr('id', `ingredient-${ingredient}`));
    
    $(`#ingredient-${ingredient}-span`).append($('<i>').attr('class', 'remove-ingredient fa-regular fa-circle-xmark')
                                                            .attr('id', `remove-ingredient-${ingredient}`)
                                                            .bind('mouseup', removeIngredient));
    updateRecipes(ingredientsArray)
}

async function updateRecipes(ingredientsArray) {
    $('#ingredient_0').val('')

    // Update the front end
    $('#result-recipes').empty()

    // Retrieve new recipes based on updated ingredients
    await fetch('/recipes/resourceful/add', {            
        'method': 'POST',
        'headers': {'Content-Type': 'application/json'},
        'body':JSON.stringify({'ingredients': ingredientsArray})
    }).then(res => res.json())
      .then((data) => {
        // Update front end based on new recipe data
        for (const recipe of data) {
            // Create new card for recipe
            $('#result-recipes').append($('<div>').attr('class', 'recipe-div res card')
                                                  .attr('id', `${recipe.id}-card`));

            // Create card header containing recipe title
            $(`#${recipe.id}-card`).append($('<div>').attr('class', 'res-header-div')
                                                     .attr('id', `${recipe.id}-header`));

            $(`#${recipe.id}-header`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                     .attr('id', `${recipe.id}-link`)
                                                     .css({'text-decoration': 'none', 'color': '#FFFFFF'}));

            $(`#${recipe.id}-link`).append($('<button>').attr('type', 'button')
                                                        .attr('class', 'recipe-link-btn btn btn-link')
                                                        .attr('id', `${recipe.id}-btn`)
                                                        .css({'text-decoration': 'none', 'color': '#FFFFFF'}));

            $(`#${recipe.id}-btn`).append($('<h2>').text(recipe.title)
                                                    .attr('class', 'recipe-title')
                                                    .attr('id', `${recipe.id}-title`));

            // Determine favorite icon status based on user favorites and bind favoriting function to label
            if ('favorite' in recipe) {
                if (recipe.favorite) {
                    $(`#${recipe.id}-link`).append($('<label>').attr('class', 'favorite-label fa-solid fa-star')
                                                               .attr('id', `${recipe.id}-label`)
                                                               .bind('mouseup', favoriteItem));

                    $(`#${recipe.id}-label`).append($('<input>').attr('type', 'checkbox')
                                                                .attr('value', `${recipe.id}`)
                                                                .attr('name', `${recipe.id}-name`)
                                                                .attr('class', 'favorite-check')
                                                                .attr('id', `${recipe.id}-check`)
                                                                .prop('checked', true));
                                                                
                } else {
                    $(`#${recipe.id}-link`).append($('<label>').attr('class', 'favorite-label fa-regular fa-star')
                                                               .attr('id', `${recipe.id}-label`)
                                                               .bind('mouseup', favoriteItem));

                    $(`#${recipe.id}-label`).append($('<input>').attr('type', 'checkbox')
                                                                .attr('value', `${recipe.id}`)
                                                                .attr('name', `${recipe.id}-name`)
                                                                .attr('class', 'favorite-check')
                                                                .attr('id', `${recipe.id}-check`)
                                                                .prop('checked', false));
                }   
            }   
            // Create card body
            $(`#${recipe.id}-card`).append($('<div>').attr('class', 'res-body-div card-body')
                                                     .attr('id', `${recipe.id}-body`));
            // Add recipe image to card with link to recipe
            $(`#${recipe.id}-body`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                   .attr('id', `${recipe.id}-img-link`));

            // const recipeImage = recipe.image.replace('312x231', '556x370')

            $(`#${recipe.id}-img-link`).append($('<img>').attr('src', recipe.image)
                                                         .attr('alt', `${recipe.title}`)
                                                         .attr('class', 'res-img'));

            // Create table to list used, unused and missed ingredients
            $(`#${recipe.id}-body`).append($('<table>').attr('class', 'res-ingredients-table')
                                                       .attr('id', `${recipe.id}-ingredients`))

            $(`#${recipe.id}-ingredients`).append($('<tr>').attr('id', `${recipe.id}-ingredients-tr`))

            $(`#${recipe.id}-ingredients-tr`).append($('<td>').attr('class', 'res-ingredient-list')
                                                              .attr('id', `${recipe.id}-used`))

            $(`#${recipe.id}-ingredients-tr`).append($('<td>').attr('class', 'res-ingredient-list')
                                                              .attr('id', `${recipe.id}-unused`))

            $(`#${recipe.id}-ingredients-tr`).append($('<td>').attr('class', 'res-ingredient-list')
                                                              .attr('id', `${recipe.id}-missed`))


            // Add used ingredients to list
            if (recipe.usedIngredients.length > 0) {
                $(`#${recipe.id}-used`).append($('<ul>').attr('class', 'used-ingredients-list')
                                                        .attr('id', `${recipe.id}-used-ingredients-list`))

                $(`#${recipe.id}-used-ingredients-list`).append($('<h4>').text('Used:')
                                                                         .attr('class', 'used-list-title')
                                                                         .attr('id', `${recipe.id}-used-list-title`))

                for (const ingredient of recipe.usedIngredients) {
                    $(`#${recipe.id}-used-ingredients-list`).append($('<p>').text(ingredient.name)
                                                                            .attr('class', 'used-ingredient-name')
                                                                            .css({'text-transform': 'capitalize'}))
                }
            }

            // Add unused ingredients to list
            if (recipe.unusedIngredients.length > 0) {
                $(`#${recipe.id}-unused`).append($('<ul>').attr('class', 'unused-ingredients-list')
                                                          .attr('id', `${recipe.id}-unused-ingredients-list`))

                $(`#${recipe.id}-unused-ingredients-list`).append($('<h4>').text('Unused:')
                                                                           .attr('class', 'unused-list-title')
                                                                           .attr('id', `${recipe.id}-unused-list-title`))
                
                for (const ingredient of recipe.unusedIngredients) {
                    $(`#${recipe.id}-unused-ingredients-list`).append($('<p>').text(ingredient.name)
                                                                              .attr('class', 'unused-ingredient-name')
                                                                              .css({'text-transform': 'capitalize'}))
                }
            }

            // Add missed ingredients to list
            if (recipe.missedIngredients.length > 0) {
                $(`#${recipe.id}-missed`).append($('<ul>').attr('class', 'missed-ingredients-list')
                                                          .attr('id', `${recipe.id}-missed-ingredients-list`))

                $(`#${recipe.id}-missed-ingredients-list`).append($('<h4>').text('Missed:')
                                                                           .attr('class', 'missed-list-title')
                                                                           .attr('id', `${recipe.id}-missed-list-title`))

                for (const ingredient of recipe.missedIngredients) {
                    $(`#${recipe.id}-missed-ingredients-list`).append($('<p>').text(ingredient.name)
                                                                              .attr('class', 'missed-ingredient-name')
                                                                              .css({'text-transform': 'capitalize'}))
                }
            }
        }
    })
}
$('#add-ingredient-btn').click(addIngredient)

// Display search input
$('#search-form-btn').click(() => {
    // Toggle search bar when search icon is clicked
    $('#search-form').toggle('slide')
})

// Favorite items
function favoriteItem(evt) {
    // Send recipe ID to flask when favorite star is clicked
    const recipeID = $(evt.target).children().val()

    if (!$(`#${recipeID}-check`).is(":checked")) {
        $(`#${recipeID}-label`).attr('class', 'favorite-label fa-solid fa-star')
    } else {
        $(`#${recipeID}-label`).attr('class', 'favorite-label fa-regular fa-star')
    }

    $.ajax({
        type: 'POST',
        url: `/recipes/favorite`,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'recipeID': recipeID})
    })
}
$('.favorite-label').mouseup(favoriteItem)

// Animate and submit user ratings
function fillStars() {
    // Fill stars in rating label
    id = $(this).children().last().attr('id')
    for (let i = 1; i <= id; i++) {
        $(`#${i}`).attr('class', 'fa-solid fa-star')
    }
}
function emptyStars() {
    // Empty stars in rating label
    id = $(this).children().last().attr('id')
    for (let i = 5; i >= 1; i--) {
        if ($(`#i${i}`).hasClass('active')) {
            $(`#${i}`).attr('class', 'fa-solid fa-star')
            return
        } else {
            $(`#${i}`).attr('class', 'fa-regular fa-star')
        }        
    }
}
function selectRating() {
    // Fill correct amount stars when rating is selected and set value for flask to recieve on form submission
    rating_input = $(this).children().first()
    for (let i = 5; i >= 1; i--) {
        if ($(`#i${i}`).hasClass('active')) {
            $(`#i${i}`).removeClass('active')
        }
    rating_input.addClass('active')
    }  
    emptyStars()
}
$('.rating-label').mouseover(fillStars)
$('.rating-label').mouseout(emptyStars)
$('.rating-label').click(selectRating)

// Get more recipes when browsing
async function moreRecipes() {

    let recipes = await fetch('/recipes/more').then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    }).then(data => {
        for (let recipe of data) {
            $('.browse-recipes-container').append($('<div>').attr('class', 'recipe-div card')
                                                            .attr('id', `${recipe.id}-card`));

            $(`#${recipe.id}-card`).append($('<div>').attr('class', 'header-div')
                                                     .attr('id', `${recipe.id}-header`));

            if (recipe.favorite) {
                $(`#${recipe.id}-header`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                         .attr('id', `${recipe.id}-link`)
                                                         .css('text-decoration', 'none'));

                $(`#${recipe.id}-link`).append($('<h2>').attr('class', 'recipe-title')
                                                        .attr('id', `${recipe.id}-title`)
                                                        .text(`${recipe.title}`));

                $(`#${recipe.id}-header`).append($('<label>').attr('for', `${recipe.id}-check`)
                                                             .attr('class', 'favorite-label fa-solid fa-star')
                                                             .attr('id', `${recipe.id}-label`));

                $(`#${recipe.id}-label`).append($('<input>').attr('type', 'checkbox')
                                                            .attr('value', `${recipe.id}`)
                                                            .attr('name', `${recipe.id}-name`)
                                                            .attr('class', 'favorite-check')
                                                            .attr('id', `${recipe.id}-check`)
                                                            .prop('checked', true));

            } else if (recipe.favorite == false) {
                $(`#${recipe.id}-header`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                         .attr('id', `${recipe.id}-link`)
                                                         .css('text-decoration', 'none'));

                $(`#${recipe.id}-link`).append($('<h2>').attr('class', 'recipe-title')
                                                        .attr('id', `${recipe.id}-title`)
                                                        .text(`${recipe.title}`));

                $(`#${recipe.id}-header`).append($('<label>').attr('for', `${recipe.id}-check`)
                                                             .attr('class', 'favorite-label fa-regular fa-star')
                                                             .attr('id', `${recipe.id}-label`));

                $(`#${recipe.id}-label`).append($('<input>').attr('type', 'checkbox')
                                                            .attr('value', `${recipe.id}`)
                                                            .attr('name', `${recipe.id}-name`)
                                                            .attr('class', 'favorite-check')
                                                            .attr('id', `${recipe.id}-check`)
                                                            .prop('checked', false));
                                                            
            } else {
                $(`#${recipe.id}-header`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                         .attr('id', `${recipe.id}-link`)
                                                         .css('text-decoration', 'none'));

                $(`#${recipe.id}-link`).append($('<h2>').attr('class', 'recipe-title')
                                                        .attr('id', `${recipe.id}-title`)
                                                        .text(`${recipe.title}`));
            }

            $(`#${recipe.id}-card`).append($('<div>').attr('class', 'card-body')
                                                     .attr('id', `${recipe.id}-body`));
            
            $(`#${recipe.id}-body`).append($('<a>').attr('href', `/recipes/${recipe.id}`)
                                                     .attr('id', `${recipe.id}-img-link`));
                                                     
            $(`#${recipe.id}-img-link`).append($('<img>').attr('src', `${recipe.image}`)
                                                         .attr('alt', `${recipe.title}`));

            $(`#${recipe.id}-body`).append($('<ul>').attr('class', 'list-group list-group-horizontal-sm')
                                                    .attr('id', `${recipe.id}-tags`));
            for (let tag in recipe.tags) {
                if (recipe.tags[tag]) {
                    $(`#${recipe.id}-tags`).append($('<span>').attr('class', 'recipe-badge badge bg-info list-group-item')
                                                              .text(tag));
                }
            }

            $(`#${recipe.id}-body`).append($('<p>').attr('class', 'browse-recipe-summary')
                                                   .attr('id', `${recipe.id}-summary`)
                                                   .html(recipe.summary));
        }
    })
}
$('#more-recipes-btn').click(moreRecipes)

// Add item to cart
function addToCart(evt) {
    let cart = []
    const ingredientID = evt.target.id
    const ingredientCount = $(`#${ingredientID}-count`).val()
    const ingredientPrice = $(`#${ingredientID}-price`).text().replace('$', '')

    const ingredientData = {'id': ingredientID, 'price': ingredientPrice, 'count': ingredientCount}

    const userCart = JSON.parse(localStorage.getItem('cart'))

    cart.push(ingredientData)

    if (userCart) {
        for (let i = 0; i < userCart.length; i++) {
            cart.push(userCart[i])
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))

    if ($(`#${ingredientID}-added`).css('opacity') == 0) {
        $(`#${ingredientID}-added`).fadeTo('fast', 1)
    }

     
}
$('.add-to-cart-btn').click(addToCart)

// Update quantity to put into cart
function changeQuantity(evt) {
    evt.preventDefault()
    let changeType = evt.target.value

    if (changeType == '+') {
        let quantity = parseInt($(evt.target).prev().val())
        quantity++
        $(evt.target).prev().attr('value', quantity)
    } else if (changeType == '-') {
        let quantity = parseInt($(evt.target).next().val())
        quantity--
        $(evt.target).next().attr('value', quantity)
    }
}
$('.change-quantity-btn').click(changeQuantity)


// Load Cart and update on delete
function deleteItem() {
    ingredient = this.id.replace('-delete', '')
    cart = JSON.parse(localStorage.getItem('cart'))

    newCart = $.grep(cart, (item) => {
        return item['id'] != ingredient
    })

    localStorage.setItem('cart', JSON.stringify(newCart))
    location.reload(true)
}
let currOrder;
async function loadCart() {
    const locallyStored = JSON.parse(localStorage.getItem('cart'))  

    if (locallyStored == null || locallyStored.length == 0) {
        return
    } else {
        await fetch('/user/cart/load', {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body':JSON.stringify({'cart': locallyStored})
        }).then(res => res.json())
        .then(data => {
            currOrder = data.cart_items;
            for (let ingredient of currOrder) {
                const ingredientNames = ingredient.name.split(' ')
                for (let i = 0; i < ingredientNames.length; i++) {
                    ingredientNames[i] = ingredientNames[i][0].toUpperCase() + ingredientNames[i].substr(1);
                }
                ingredientName = ingredientNames.join(' ');

                $('#cart-body').append($('<tr></tr>').attr('class', 'cart-row')
                                                     .attr('id', `${ingredient.id}-row-1`))
    
                $('#cart-body').append($('<tr></tr>').attr('class', 'cart-row')
                                                     .attr('id', `${ingredient.id}-row-2`))
    
                $('#cart-body').append($('<tr></tr>').attr('class', 'cart-row')
                                                     .attr('id', `${ingredient.id}-row-3`))

                $('#cart-body').append($('<tr></tr>').attr('class', 'cart-row')
                                                     .attr('id', `${ingredient.id}-row-4`))
    
                $(`#${ingredient.id}-row-1`).append($(`<td rowspan="4"><img src="${ingredient.image}" alt="${ingredientName}"></td>`).attr('class', 'cart-img')
                                                                                                                                     .attr('id', `${ingredient.id}-image`))
                            
                $(`#${ingredient.id}-row-1`).append($(`<td><h3 style="margin-top: 2rem; margin-bottom: 0; margin-right:1rem; display:inline">${ingredientName}</h3></td>`).attr('class', 'cart-ingredient-name')
                                                                                                                                                                          .attr('id', `${ingredient.id}-name`))

                $(`#${ingredient.id}-name`).append($(`<td style="padding:0;"><button type="button" style="display:inline;"></button></td>`).html('<i class="text-danger fa-regular fa-circle-xmark"></i>')
                                                                                                                                           .attr('class', 'delete-btn btn'))
                                                                                                                                           .attr('id', `${ingredient.id}-delete`)
                                                                                                                                           .bind('click', deleteItem)
                            
                $(`#${ingredient.id}-row-2`).append($(`<td>Unit Price: $${ingredient.price}</td>`).attr('class', 'cart-ingredient-price')
                                                                                                  .attr('id', `${ingredient.id}-price`))
    
                $(`#${ingredient.id}-row-3`).append($(`<td>Amount: ${ingredient.count}</td>`).attr('class', 'cart-ingredient-count')
                                                                                             .attr('id', `${ingredient.id}-count`))

                $(`#${ingredient.id}-row-4`).append($(`<td style="margin-bottom: 3rem;"><h5 style="display:inline">Total Price: </h5> $${ingredient.total}</td>`).attr('class', 'cart-ingredient-total')
                                                                                                                                                                 .attr('id', `${ingredient.id}-total`))
            }
            $('#user-total').append(`<h3>Order Total: $<p style="display:inline;">${data.cart_total}</p></h3>`)
        })
    }
}
$('#cart-table').ready(loadCart)

// Cart submission
async function submitCart() {
    fetch('/user/cart/submit', {
        'method': 'POST',
        'headers': {'Content-Type': 'application/json'},
        'body':JSON.stringify({'order': currOrder})})
                .then(res => {
                    if (res.status == 200) {
                        currOrder = ''
                        localStorage.clear()
                        window.location.href = res.url;
                    }
                    throw new Error('Something is wrong :( Is your cart empty?')
                })
}
$('#submit-order').click(submitCart)

$('#submit-filters-btn').click(() => {$('#filter-form').submit()})

$('.nutrition-data-btn').click(() => {
    $('.nutrition-table-div').slideToggle('slow')
    $('.nutrition-data-btn').toggle()
})









