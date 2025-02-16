const recipe = {
    name: "",
    ratings: 5,
    cooking_time: "",
    tags: [],
    description: "",
    ingredients: [],
    method: [], 
};

const container = document.querySelector(".container")
const loader = document.querySelector(".loader");
const name = document.querySelector(".heading");
const ratings = document.querySelector(".star");
const cookTime = document.querySelector(".cook-time");
const tags = document.querySelector(".badges");
const description = document.querySelector(".recipe-description");
const ingredients = document.querySelector(".recipe-ingredients");
const method = document.querySelector(".prep");
const searchPage = document.querySelector(".search-page");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-btn");
const closeButton = document.querySelector(".close-btn")
const alert = document.querySelector(".alert")


searchButton.addEventListener('click', () => {
    const value = searchInput.value;
    
    if (value === "") {
        alert.classList.add('show');
        
        setTimeout(() => {
            alert.classList.add('animate__animated', 'animate__fadeOutDown');
            setTimeout(() => {
                alert.classList.remove('show', 'animate__animated', 'animate__fadeOutDown');
            }, 500);
        }, 2500);
    } else {
        alert.classList.remove('show');
        createRecipe(value);
    }
});

closeButton.addEventListener('click', () => {
    container.style.display = "none";
    searchPage.style.display = "flex";
    searchInput.value = "";
});

function displayRecipe(recipe) {
    name.innerHTML = recipe.name;
    ratings.innerHTML = '★'.repeat(recipe.ratings);
    cookTime.innerHTML = recipe.cooking_time;
    tags.innerHTML = recipe.tags.map((tags, index) => `<span class="badge text-bg-success animate__animated animate__zoomIn" style="animation-delay: ${0.2 * index}s">${tags}</span>`).join('');
    description.innerHTML = recipe.description;
    ingredients.innerHTML = recipe.ingredients.map((ingredients, index) => `<li class="text-line animate__animated animate__fadeInDown" style="animation-delay: ${0.2 * index}s">${ingredients}</li>`).join('');
    method.innerHTML = recipe.method.map((method, index) => `<li class="text-line animate__animated animate__fadeInDown" style="animation-delay: ${0.2 * index}s"><span>${(index + 1)}.</span> ${method}</li>`).join('');
    
}

function createRecipe(text){
    const prompt = getPrompt(text);

    searchPage.style.display = "none";
    loader.style.display = "flex";

    generateText(prompt).then((response) => {

        const data = getContentFromJSONMarkdown(response);

        console.log(data);
        
        displayRecipe(data);
        setupEvents();

        loader.style.display = "none";
        container.style.display = "block";
    });
}

function getContentFromJSONMarkdown(markdown) {
    const jsonMatch = markdown.match(/```json\n([\s\S]*?)\n```/);
  
    if (!jsonMatch) {
      return null;
    }
  
    const jsonString = jsonMatch[1];
  
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

// Gemini AI
function getPrompt(prompt){
    return `You are the world's greatest chef. You can cook any food there is, you are a perfectionist yet you explain your recipes so well that a beginner can understand 

    Based on the user's prompt, create a food recipe 

    <example> 
        Prompt: Create a milk cereal 

        <response>
                <json>
                        {
                            "name": "Milk cereal",
                            "description": "Milk cereal is a simple and comforting breakfast dish. It typically consists of rolled oats cooked in milk, often sweetened with honey or maple syrup. This warm and nourishing bowl can be customized with a variety of toppings, such as fresh fruits, nuts, seeds, and spices like cinnamon. Milk cereal is a versatile and easy-to-prepare option for a quick and satisfying start to the day.",
                            "ingredients": [
                                    "1 cup milk",
                                    "1 cup flour",
                                    "1 tsp baking powder",
                                    "1/2 tsp salt",
                                    "1/2 tsp cinnamon",
                                    "1/4 tsp nutmeg",
                                    "1/4 tsp ginger",
                                    "2 eggs",
                                    "1 tbsp honey",
                                    "1/2 cup sugar",
                                    "1 tsp vanilla extract",
                                    "1/2 cup butter",
                                    "1/4 cup all-purpose flour",
                                    "3 tbsp cold water"
                            ],
                            "method": [
                                    "Preheat oven to 350°F (180°C).",
                                    "In a large bowl, whisk together the flour, baking powder, salt, cinnamon, nutmeg, ginger, eggs, honey, sugar, and vanilla extract.",
                                    "In a separate bowl, beat the butter and flour together until smooth.",
                                    "Add the milk and beat until smooth.",
                                    "Gradually add the dry ingredients to the wet ingredients, mixing until just combined.",
                                    "Pour into a greased 9x13 inch baking dish.",
                                    "Bake for 25-30 minutes, or until golden brown.",
                                    "Let cool completely before slicing and serving."
                            ],
                            tags: ["Healthy", "Easy", "Sweet", "Dessert"],
                            ratings: 2,
                            cooking_time: "2 min",
                        }
                </json>

        </response>
    </example>

    Only return the json response, do not include any other text.

    User prompt: ${prompt}`;
}      

async function generateText(prompt, model = "gemini-2.0-flash-exp") {
    const API_KEY = "AIzaSyA6SNvojD1m8i8E-O9qTYqKi6CAjgErnkA"; // Will remove in future
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt, }] }],
        }),
    }).then((response) => response.json()).then((data) => {
        const result = data.candidates[0].content.parts[0].text;

        return result;
    });
}

async function image() {
    const api_key = "4f4c23e89c9a64479268adfd3d9b1c71479ecacac85c5684cfeb296652acfd5c"
    fetch(`https://api.unsplash.com/search/photos?query=${searchInput.value}&client_id=${api_key}`)
        .then(response => response.json())
        .then(data => {
            console.log();
            console.log(searchInput.value);
            
            document.getElementById("local").src = data.results[0].urls.regular;

        })
        .catch(error => console.error("error", error));
}




function setupEvents() {
    const textLines = document.querySelectorAll(".text-line");

    textLines.forEach(textLine => {
        textLine.addEventListener('click', () => {
            if (textLine.style.textDecoration === "line-through") {
                textLine.style.textDecoration = "none";
            } else {
                textLine.style.textDecoration = "line-through";
            }
        });
    });
}
