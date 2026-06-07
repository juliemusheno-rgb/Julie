/*
 * Our Family Recipe Book — seed data
 * ----------------------------------
 * These are the recipes the app starts with the very first time it runs.
 * After that, everything lives in the browser's localStorage on this device,
 * so edits, additions, and deletions stick around between launches.
 *
 * To reset back to this original collection, use  File ▸ Restore Original Recipes
 * (or the "Reset" action). Your own additions live only in localStorage.
 *
 * Recipe shape:
 *   {
 *     id, title, category, source, story, note,
 *     meta:             [ { k: "Yields", v: "32 pieces" }, ... ],
 *     ingredientGroups: [ { heading: "Ingredients", items: ["1 lb ...", ...] }, ... ],
 *     steps:            [ "Preheat oven ...", ... ]
 *   }
 */

// Chapter order, exactly as in the printed book.
window.COOKBOOK_CATEGORIES = [
  "Appetizers",
  "Soups & Chilis",
  "Salads & Sides",
  "Mains",
  "Breakfast & Breads",
  "Desserts",
  "Drinks",
];

window.COOKBOOK_META = {
  title: "Our Family",
  titleLine2: "Recipe Book",
  subtitle: "Recipe Book",
  collection: "Sage & Clay",
  tagline: "a collection of the dishes we love best",
};

window.COOKBOOK_SEED = [
  // ── APPETIZERS ───────────────────────────────────────────────────────────
  {
    id: "bacon-wrapped-dates-with-ricotta",
    title: "Bacon-Wrapped Dates with Ricotta",
    category: "Appetizers",
    source: "adapted from allrecipes.com",
    story: "A sweet-and-savory two-bite appetizer that always vanishes first. The ricotta tucked inside stays creamy under the crisp bacon.",
    meta: [
      { k: "Yields", v: "32 pieces" },
      { k: "Prep", v: "20 min" },
      { k: "Bake", v: "40 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 lb sliced bacon, cut into thirds",
          "1 lb pitted Medjool dates",
          "4 oz ricotta cheese",
        ],
      },
    ],
    steps: [
      "Preheat oven to 375°. Line a rimmed baking sheet with foil.",
      "Fill a sandwich bag with ricotta and snip off a corner to make a piping bag.",
      "Pull open each date and pipe in ricotta to fill the cavity.",
      "Wrap a piece of bacon around each date, secure with a toothpick, and set on the baking sheet.",
      "Bake 30 to 40 minutes, until the bacon is crisp, turning the dates after the first 20 minutes for even cooking.",
    ],
  },
  {
    id: "seven-layer-fiesta-dip",
    title: "Seven Layer Fiesta Dip",
    category: "Appetizers",
    source: "adapted from mccormick.com",
    story: "Everyone needs a good seven layer dip, and this is mine. I like to make a little design with the top layer so it looks fancy. Our secret that it is SO easy.",
    meta: [
      { k: "Yields", v: "8 cups" },
      { k: "Prep", v: "15 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 can (16 oz) refried beans",
          "1 container (16 oz) sour cream",
          "1 packet taco seasoning mix",
          "1 package (8 oz) shredded cheddar (2 cups)",
          "1 cup prepared guacamole",
          "1 cup chopped tomatoes",
          "1/2 cup sliced green onions",
          "1/2 cup sliced black olives",
          "Tortilla chips, to serve",
        ],
      },
    ],
    steps: [
      "Spread the refried beans in a shallow serving dish.",
      "Mix the sour cream and taco seasoning in a small bowl until well blended, then spread over the beans.",
      "Top with layers of cheese, guacamole, tomatoes, onions, and olives. Serve with tortilla chips.",
    ],
  },
  {
    id: "guacamole",
    title: "Guacamole",
    category: "Appetizers",
    source: "from my friend Payne Broome",
    story: "My friend Payne Broome invented this over years of tweaking a basic guacamole. It is amazing, and it makes a ton, so it is perfect for a party.",
    meta: [
      { k: "Yields", v: "a big bowl" },
      { k: "Prep", v: "20 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "6 ripe avocados",
          "2 tomatoes, diced",
          "1/2 sweet Vidalia onion, diced",
          "2 limes, juiced (we usually add more)",
          "1 tbsp mayonnaise",
          "Salt and pepper to taste",
          "Tortilla chips, to serve",
        ],
      },
    ],
    steps: [
      "Halve the avocados, remove the pits, and score the flesh in a crosshatch. Scoop it out with a spoon.",
      "Combine the avocado with the tomatoes, onion, lime juice, and mayonnaise. Season with salt and pepper to taste.",
      "Serve with tortilla chips.",
      "To make ahead, drop the avocado pits into the bowl, cover with plastic wrap pressed to the surface, and refrigerate. Remove the pits just before serving to keep it from browning.",
    ],
  },
  {
    id: "baked-goat-cheese-dip",
    title: "Baked Goat Cheese Dip",
    category: "Appetizers",
    source: "adapted from myrecipes.com",
    story: "Goat cheese and cream cheese baked under a spicy tomato topping. It looks fancy but is SO easy, and you can assemble it ahead and freeze it for up to a month. Serve with slices of baguette.",
    note: "Make ahead: prepare through the cheese and tomato layers, cover, and freeze up to 1 month. Thaw overnight in the fridge, stand 30 minutes at room temperature, then bake as directed.",
    meta: [
      { k: "Yields", v: "12 servings" },
    ],
    ingredientGroups: [
      {
        heading: "The tomato topping",
        items: [
          "1 small onion, diced",
          "1 tbsp olive oil",
          "2 garlic cloves, minced",
          "2 tbsp tomato paste",
          "1/4 tsp dried crushed red pepper",
          "Pinch of sugar",
          "1 can (14.5 oz) petite-diced tomatoes",
          "1/4 cup chopped sun-dried tomatoes in oil",
          "1/4 cup torn basil leaves",
          "Salt and pepper to taste",
        ],
      },
      {
        heading: "The cheese base",
        items: [
          "2 logs (4 oz each) goat cheese, softened",
          "1 package (8 oz) cream cheese, softened",
          "Bread cubes, to serve",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350°. Saute the onion in the oil in a saucepan over medium-high heat for 5 minutes, until tender. Stir in the garlic, tomato paste, red pepper, and sugar and cook 1 minute.",
      "Stir in the diced and sun-dried tomatoes. Reduce to medium-low and simmer about 10 minutes, until very thick. Off the heat, stir in the basil and season with salt and pepper.",
      "Stir the goat cheese and cream cheese together until smooth. Spread into a lightly greased 9-inch shallow baking dish and top with the tomato mixture.",
      "Bake 15 to 18 minutes, until heated through. Serve with bread cubes.",
    ],
  },

  // ── SOUPS & CHILIS ───────────────────────────────────────────────────────
  {
    id: "taco-soup",
    title: "Taco Soup",
    category: "Soups & Chilis",
    source: "adapted from tastefullysimple.com",
    story: "Great for a crowd, or for an easy dinner with plenty left to freeze. Make it in the slow cooker so you can set it and forget it until you are ready to eat.",
    meta: [
      { k: "Yields", v: "10 to 12 servings" },
      { k: "Prep", v: "15 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "2 lb browned ground beef or shredded cooked chicken",
          "1 jar black bean and corn salsa",
          "2 tbsp taco seasoning",
          "2 cans (14 oz) Italian stewed diced tomatoes",
          "2 cans (12 oz) tomato sauce",
          "1 large onion, diced",
          "Shredded cheddar, sour cream, and corn chips, to serve",
        ],
      },
    ],
    steps: [
      "Combine all ingredients. Simmer covered in a Dutch oven about 1 hour, or cook covered on low in a slow cooker for 2 to 3 hours.",
      "Serve with shredded cheddar, sour cream, and corn chips.",
    ],
  },
  {
    id: "white-bean-chili",
    title: "White Bean Chili",
    category: "Soups & Chilis",
    source: "adapted from publix.com",
    story: "I love this chili and make it so often in the winter that the pot barely gets a rest. Make a double batch and freeze some; it reheats beautifully from frozen. Great topped with sour cream and served with cornbread.",
    meta: [
      { k: "Yields", v: "8 servings" },
      { k: "Total", v: "35 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 package (12 oz) reduced-fat sausage",
          "1/2 lb ground turkey breast",
          "1 bag (10 oz) frozen seasoning blend (onion, bell pepper, celery)",
          "1 tbsp roasted garlic",
          "1 package (1.25 oz) taco seasoning mix",
          "2 cans (15.8 oz) great northern beans, undrained",
          "1 can (14 oz) chicken broth",
          "1 can (4.5 oz) chopped green chiles",
          "1 can (16 oz) refried beans with green chiles",
        ],
      },
    ],
    steps: [
      "Heat a large saucepan over medium-high for 2 to 3 minutes. Add the sausage, turkey, seasoning blend, and garlic. Brown 10 to 12 minutes until no pink remains, breaking up the meat as it cooks.",
      "Stir in the taco seasoning, cover, and cook 1 minute. Stir in the beans with their liquids and the remaining ingredients, cover, and bring to a boil. Serve.",
    ],
  },
  {
    id: "thick-chunky-sirloin-chili",
    title: "Thick & Chunky Sirloin Chili",
    category: "Soups & Chilis",
    source: "adapted from cookingwithruthie.com",
    story: "A meaty chili for a cold day. Double it so you have plenty to freeze for the next wintry night. I love it with cornbread baked in the cast iron skillet.",
    meta: [
      { k: "Yields", v: "6 to 8 servings" },
      { k: "Prep", v: "20 min" },
      { k: "Cook", v: "2 to 3 hr" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "2 lb sirloin, cubed (or 1 lb ground beef + 1 lb sirloin)",
          "1 tbsp vegetable oil",
          "1 large onion, chopped",
          "2 garlic cloves, minced",
          "1 can (15 oz) tomato sauce",
          "1 can (6 oz) tomato paste",
          "1 can (15 oz) diced tomatoes with green chilies",
          "1 1/2 cups beef broth or 1 bottle (12 oz) dark beer",
          "1 tsp ground cumin",
          "1 tsp paprika",
          "2 tsp chili powder",
          "1 tsp oregano",
          "1 tsp salt",
          "1/2 tsp pepper",
          "1 tsp Worcestershire sauce",
          "1 can (28 oz) chili beans",
        ],
      },
    ],
    steps: [
      "Warm the oil over medium-high heat. Add the sirloin and cook through, about 4 minutes per side. Add the onion and garlic and saute until the onion is translucent. Transfer to a 4-quart slow cooker.",
      "Stir in the remaining ingredients and cook on low 2 to 3 hours (all day is even better, the longer the better).",
    ],
  },

  // ── SALADS & SIDES ───────────────────────────────────────────────────────
  {
    id: "fresh-mozzarella-tomato-basil-couscous-salad",
    title: "Fresh Mozzarella, Tomato & Basil Couscous Salad",
    category: "Salads & Sides",
    source: "adapted from Cooking Light",
    story: "Bright, fast, and lovely alongside almost anything. Part-skim mozzarella works in place of fresh.",
    meta: [
      { k: "Yields", v: "5 servings" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "2 cups diced tomato",
          "3/4 cup (3 oz) diced fresh mozzarella",
          "3 tbsp minced shallots",
          "2 tsp extra-virgin olive oil",
          "1/2 tsp salt",
          "1/2 tsp black pepper",
          "1 garlic clove",
          "1 1/4 cups water",
          "1 cup uncooked couscous",
          "1/4 cup chopped fresh basil",
          "Basil leaves, optional, to garnish",
        ],
      },
    ],
    steps: [
      "Combine the first seven ingredients in a large bowl. Cover and marinate in the refrigerator 30 minutes.",
      "Bring the water to a boil, gradually stir in the couscous, remove from heat, cover, and let stand 5 minutes. Fluff with a fork and cool.",
      "Add the couscous and fresh basil to the tomato mixture and toss gently. Garnish with basil leaves if desired.",
    ],
  },
  {
    id: "macaroni-three-cheeses",
    title: "Macaroni & Three Cheeses",
    category: "Salads & Sides",
    source: "adapted from Everyday Food",
    story: "A grown-up three-cheese mac with a crunchy crumb topping. Swap in your favorite melting cheeses, mozzarella, Monterey Jack, and fontina are all great.",
    meta: [
      { k: "Yields", v: "8 servings" },
      { k: "Prep", v: "25 min" },
      { k: "Bake", v: "20 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "6 tbsp unsalted butter",
          "Coarse salt and ground pepper",
          "1 lb medium pasta shells or corkscrew",
          "1/4 cup all-purpose flour",
          "1 tsp dry mustard powder",
          "4 cups whole milk",
          "4 oz sharp white cheddar, grated (1 cup)",
          "4 oz Havarti, grated (1 cup)",
          "4 oz Muenster, grated (1 cup)",
          "Coarse bread crumbs, for topping",
        ],
      },
    ],
    steps: [
      "Preheat oven to 400° and butter a 4-quart baking dish. Cook the pasta 2 minutes short of al dente, drain, and return to the pot.",
      "Melt the butter; reserve 2 tablespoons for the topping. Whisk the flour and mustard into the remaining butter and cook 1 minute without browning. Whisk in the milk, bring to a boil, then reduce and simmer 2 to 3 minutes until thickened.",
      "Off the heat, whisk in the cheeses and season generously. Toss with the pasta and transfer to the dish.",
      "Toss the bread crumbs with the reserved butter and scatter over the top. Bake 15 to 20 minutes until golden and bubbling. Cool 5 minutes before serving.",
    ],
  },

  // ── MAINS ────────────────────────────────────────────────────────────────
  {
    id: "mama-freed-s-lasagna",
    title: "Mama Freed's Lasagna",
    category: "Mains",
    source: "Mama Freed's recipe",
    story: "A make-ahead lasagna built to live in the freezer until the day you need it. The meat sauce makes enough for two, so freeze half or halve it for one. The ketchup stirred into the top layer of sauce is the little secret that makes it.",
    note: "Get the good stuff: San Marzano crushed tomatoes and Cento tomato paste, half hot and half sweet Italian sausage (sweet over mild if they have it). Fresh parsley, basil, bay leaves, and rosemary make a real difference.",
    meta: [
      { k: "Serves", v: "6 to 8" },
      { k: "Oven", v: "350°" },
      { k: "Bake", v: "about 70 min" },
    ],
    ingredientGroups: [
      {
        heading: "Meat sauce (makes enough for two)",
        items: [
          "1 lb ground pork",
          "1 lb ground beef",
          "1 lb Italian sausage (half hot)",
          "4 cans (6 oz) Contadina tomato paste",
          "2 cans (28 oz) crushed tomatoes",
          "3 tbsp sweet basil",
          "3 tbsp dried parsley",
          "1 tsp marjoram or oregano",
          "1 tsp rosemary",
          "1 tsp salt",
          "3 cloves garlic, minced",
          "3 large bay leaves",
        ],
      },
      {
        heading: "Cheese layer (per 9x13)",
        items: [
          "3 cups large curd cottage cheese",
          "1/2 cup grated parmesan",
          "2 eggs, beaten",
          "2 tsp salt",
          "1/2 tsp pepper",
          "2 tbsp dried parsley (more if fresh)",
        ],
      },
      {
        heading: "To assemble (per 9x13)",
        items: [
          "1 lb sliced mozzarella",
          "1 box lasagna noodles",
          "1/2 cup ketchup",
        ],
      },
    ],
    steps: [
      "Cook the meat sauce the day before, or for at least 2 hours. Cook the lasagna noodles as directed, or use no-boil noodles.",
      "Spray a 9x13 casserole dish with cooking spray and lay noodles on the bottom.",
      "Reserve 1 cup of meat sauce for the top. Spread half the remaining sauce over the noodles.",
      "Spread half the cheese layer over the sauce, then layer half the mozzarella.",
      "Repeat the layers, then top with a final layer of noodles.",
      "Mix the 1/2 cup ketchup into the reserved meat sauce and spread over the top.",
      "Cover with plastic wrap, then aluminum foil, and freeze.",
      "Serving day: remove from the freezer and warm on the counter 30 minutes. Preheat oven to 350°.",
      "Place in the oven 90 minutes before you plan to eat, leaving the plastic wrap and foil on.",
      "Remove the plastic wrap and foil after 45 to 50 minutes (save the foil).",
      "Cook until bubbling, about 70 minutes total. Rest on the counter 10 to 15 minutes with foil on top before slicing.",
    ],
  },
  {
    id: "boarding-house-meatloaf",
    title: "Boarding House Meatloaf",
    category: "Mains",
    source: "adapted from The Southern Living Community Cookbook",
    story: "This delicious meatloaf came from a community cookbook I was given years ago. Everyone in my house loves it, and you all know how picky my small people can be! Easy, fast, and flavorful. Serve it with potatoes and rolls on a cold, cold night.",
    meta: [
      { k: "Yields", v: "one 9x5 loaf" },
      { k: "Prep", v: "15 min" },
      { k: "Cook", v: "1 hr 10 min" },
    ],
    ingredientGroups: [
      {
        heading: "The loaf",
        items: [
          "1 1/2 lb lean ground beef",
          "1/2 green bell pepper, finely chopped",
          "1/2 small onion, finely chopped",
          "2 large eggs, beaten",
          "3/4 cup uncooked regular oats",
          "1/4 cup ketchup",
          "1 1/2 tsp salt",
        ],
      },
      {
        heading: "The sauce",
        items: [
          "2 tbsp butter",
          "1/2 small onion, chopped",
          "1/2 green bell pepper, chopped",
          "3/4 cup ketchup or chili sauce",
          "1 tbsp cider vinegar",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350° and lightly grease a 9x5-inch loaf pan.",
      "Stir together the beef, bell pepper, onion, eggs, oats, ketchup, and salt. Shape into a loaf and place in the pan. Bake 45 minutes.",
      "Meanwhile, make the sauce: melt the butter in a skillet over medium-high, add the onion and bell pepper, and cook 5 minutes until tender. Stir in the ketchup and vinegar and simmer 5 minutes until slightly thickened.",
      "Remove the loaf, pour off the pan juices, and spread half the sauce over the top. Bake 25 minutes more.",
      "Serve hot with the remaining sauce.",
    ],
  },
  {
    id: "simple-bolognese",
    title: "Simple Bolognese",
    category: "Mains",
    source: "from Giada's Everyday Italian",
    story: "A quick weeknight bolognese that is just as rich as the slow version. Perfect over any pasta shape, with a salad and good bread. It doubles and freezes beautifully.",
    meta: [
      { k: "Yields", v: "about 1 quart" },
      { k: "Serves", v: "4 over pasta" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1/4 cup extra-virgin olive oil",
          "1 medium onion, minced",
          "2 garlic cloves, minced",
          "1 celery stalk, minced",
          "1 carrot, peeled and minced",
          "1 lb ground beef chuck",
          "1 can (28 oz) crushed tomatoes",
          "1/4 cup chopped fresh flat-leaf parsley",
          "8 fresh basil leaves, chopped",
          "1/2 tsp salt, plus more to taste",
          "1/2 tsp black pepper, plus more to taste",
          "1/4 cup grated Pecorino Romano",
        ],
      },
    ],
    steps: [
      "Heat the oil over medium. Add the onion and garlic and saute until very tender, about 8 minutes. Add the celery and carrot and saute 5 minutes.",
      "Raise the heat to high, add the beef, and cook about 10 minutes until no longer pink, breaking up any lumps.",
      "Add the tomatoes, parsley, basil, and 1/2 teaspoon each salt and pepper. Cook over medium-low about 30 minutes, until the sauce thickens.",
      "Stir in the cheese and season to taste. Serve over your pasta of choice.",
    ],
  },
  {
    id: "penne-with-spicy-vodka-tomato-cream-sauce",
    title: "Penne with Spicy Vodka Tomato Cream Sauce",
    category: "Mains",
    source: "adapted from allrecipes.com",
    story: "A nice change from your typical tomato sauce. Do not worry about the alcohol, it cooks off. It doubles and freezes well, so I make a triple batch. It is spicy, so adjust the red pepper for your crowd. Lovely with rigatoni or corkscrew noodles.",
    meta: [
      { k: "Yields", v: "8 servings" },
      { k: "Prep", v: "10 min" },
      { k: "Cook", v: "15 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 lb uncooked penne",
          "1/4 cup extra-virgin olive oil",
          "4 garlic cloves, minced",
          "1/2 tsp crushed red pepper flakes",
          "1 can (28 oz) crushed tomatoes",
          "3/4 tsp salt",
          "2 tbsp vodka",
          "1/2 cup heavy whipping cream",
          "1/4 cup chopped fresh parsley",
          "2 links (3.5 oz) sweet Italian sausage",
        ],
      },
    ],
    steps: [
      "Bring a large pot of lightly salted water to a boil. Cook the pasta 8 to 10 minutes until al dente, then drain.",
      "Heat the oil in a large skillet over moderate heat. Remove the sausage casings, add the meat, and cook until brown, breaking it up. Add the garlic and red pepper and cook, stirring, until the garlic is golden.",
      "Add the tomatoes and salt, bring to a boil, then reduce and simmer 15 minutes.",
      "Add the vodka and cream and bring to a boil. Reduce to low, add the pasta, and toss 1 minute. Stir in the parsley and serve.",
    ],
  },
  {
    id: "easy-chicken-enchiladas",
    title: "Easy Chicken Enchiladas",
    category: "Mains",
    source: "adapted from allrecipes.com",
    story: "A great recipe for a quick dinner. Few ingredients and not much time.",
    meta: [
      { k: "Yields", v: "6 servings" },
      { k: "Prep", v: "20 min" },
      { k: "Bake", v: "30 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 package (8 oz) cream cheese",
          "1 cup salsa",
          "2 cups chopped cooked chicken breast",
          "1 can (15.5 oz) pinto beans, drained",
          "6 flour tortillas (6 inch)",
          "2 cups shredded Colby-Jack cheese",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350° and lightly grease a 9x13-inch baking dish.",
      "In a saucepan over medium heat, combine the cream cheese and salsa and cook, stirring, until melted and smooth. Stir in the chicken and pinto beans.",
      "Fill the tortillas, roll, and place seam-side down in the dish. Spread cheese over the top and cover with foil.",
      "Bake 30 minutes, until heated through. Garnish with lettuce, tomatoes, or sour cream.",
    ],
  },
  {
    id: "chicken-sun-dried-tomato-penne",
    title: "Chicken & Sun-Dried Tomato Penne",
    category: "Mains",
    source: "adapted from Everyday Food",
    story: "A tasty, quick recipe that makes two casseroles, dinner tonight and one for the freezer.",
    meta: [
      { k: "Yields", v: "8 servings" },
      { k: "Prep", v: "35 min" },
      { k: "Bake", v: "25 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "6 tbsp butter",
          "Coarse salt and ground pepper",
          "1 lb penne rigate",
          "1 tsp olive oil",
          "2 boneless skinless chicken breast halves (8 oz each), halved horizontally",
          "1/2 cup plus 2 tbsp all-purpose flour",
          "4 garlic cloves, minced",
          "6 cups whole milk",
          "10 oz white mushrooms, thinly sliced",
          "1/2 cup oil-packed sun-dried tomatoes, thinly sliced",
          "1 1/2 cups shredded provolone (6 oz)",
          "1 cup finely grated Parmesan (4 oz)",
        ],
      },
    ],
    steps: [
      "Preheat oven to 400° and grease two 2-quart dishes. Cook the pasta 3 minutes short of al dente, drain, and return to the pot.",
      "Heat the oil over medium-high. Season and cook the chicken until opaque, 3 to 5 minutes per side, then slice thin.",
      "Melt the butter in a heavy pot, add the flour and garlic, and cook 1 minute. Gradually whisk in the milk and bring to a simmer. Add the mushrooms and tomatoes and cook 1 minute. Off the heat, stir in the provolone and 1/2 cup Parmesan.",
      "Add the chicken and pasta, season, and divide between the dishes. Sprinkle each with 1/4 cup Parmesan.",
      "Bake one dish uncovered about 25 minutes, until golden and bubbling. Let stand 5 minutes.",
      "For the freezer dish, cover tightly with foil and freeze up to 3 months. To bake from frozen: 400°, covered, about 1 1/2 hours, then uncover 15 minutes more.",
    ],
  },
  {
    id: "dave-s-low-country-boil",
    title: "Dave's Low Country Boil",
    category: "Mains",
    source: "adapted from Everyday Food",
    story: "Famous in the Low Country of Georgia and South Carolina, and best done on an outdoor cooker. We do this every summer, at least three times at the lake. Sausage, shrimp, crab, potatoes, and corn in one big pot. It is great for a crowd.",
    note: "Experiment with lemons, bay leaves, onions, crawfish, clams, scallops, or lobster tail, whatever you like.",
    meta: [
      { k: "Yields", v: "15 servings" },
      { k: "Prep", v: "30 min" },
      { k: "Cook", v: "30 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 tbsp Old Bay seasoning, or to taste",
          "5 lb new potatoes",
          "3 packages (16 oz) cooked kielbasa, cut into 1-inch pieces",
          "8 ears fresh corn, husked",
          "5 lb whole crab, broken into pieces",
          "4 lb fresh shrimp, peeled and deveined",
        ],
      },
    ],
    steps: [
      "Heat a large pot of water over an outdoor cooker (or medium-high indoors). Add the Old Bay and bring to a boil. Add the potatoes and sausage and cook about 10 minutes.",
      "Add the corn and crab and cook 5 minutes more. Add the shrimp when everything else is nearly done and cook 3 to 4 minutes.",
      "Drain and pour out onto a newspaper-covered picnic table. Grab a plate and dig in.",
    ],
  },
  {
    id: "tomato-beef-casserole-with-polenta-crust",
    title: "Tomato & Beef Casserole with Polenta Crust",
    category: "Mains",
    source: "adapted from Southern Living",
    story: "An easy casserole with a yummy polenta crust, a nice change from pasta or rice.",
    note: "For an Italian version, swap in Italian sausage and an Italian cheese blend, and saute a chopped green bell pepper with the onion.",
    meta: [
      { k: "Yields", v: "8 servings" },
      { k: "Prep", v: "20 min" },
      { k: "Bake", v: "35 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 tsp salt",
          "1 cup plain yellow cornmeal",
          "1/2 tsp Montreal steak seasoning",
          "1 cup (4 oz) shredded sharp cheddar, divided",
          "1 lb ground chuck",
          "1 cup chopped onion",
          "1 medium zucchini, halved and sliced (about 2 cups)",
          "1 tbsp olive oil",
          "2 cans (14.5 oz) petite diced tomatoes, drained",
          "1 can (6 oz) tomato paste",
          "2 tbsp chopped fresh flat-leaf parsley",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350°. Bring 3 cups water and the salt to a boil. Whisk in the cornmeal, reduce to low, and simmer 3 minutes, whisking, until thick. Off the heat, stir in the steak seasoning and 1/4 cup cheddar. Spread into a greased 11x7-inch dish.",
      "Brown the ground chuck in a skillet over medium-high about 10 minutes, then drain and set aside.",
      "Saute the onion and zucchini in the oil over medium 5 minutes until crisp-tender. Stir in the beef, tomatoes, and tomato paste and simmer 10 minutes. Pour over the cornmeal crust and sprinkle with the remaining 3/4 cup cheese.",
      "Bake 30 minutes until bubbly. Sprinkle with parsley before serving.",
    ],
  },
  {
    id: "shrimp-curry",
    title: "Shrimp Curry",
    category: "Mains",
    source: "adapted from parents.com",
    story: "A lighter take on a classic. We like it with chicken too. Use a whole can of coconut milk and double everything if you like it saucy.",
    note: "To use chicken instead of shrimp, swap in 2 boneless skinless chicken breasts.",
    meta: [
      { k: "Yields", v: "4 servings" },
      { k: "Total", v: "35 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 cup chopped onions",
          "4 tsp olive oil, divided",
          "1 green or red bell pepper, cut into strips",
          "1 lb uncooked peeled shrimp",
          "1 tbsp red curry paste",
          "2 tbsp water",
          "1 cup light coconut milk",
          "3 cups cooked brown rice",
        ],
      },
    ],
    steps: [
      "Saute the onions in 2 teaspoons oil over medium until caramelized, 8 to 10 minutes. In a second skillet, saute the pepper strips in the remaining oil about 3 minutes, then add the shrimp and cook 2 to 3 minutes until opaque.",
      "Puree the onions and curry paste with the water until almost smooth. Add to the shrimp with the coconut milk, bring to a boil, and cook 2 to 3 minutes to thicken. Stir in the rice and cook another minute or two.",
    ],
  },
  {
    id: "braised-lamb-shanks-with-orzo-goat-cheese",
    title: "Braised Lamb Shanks with Orzo & Goat Cheese",
    category: "Mains",
    source: "from Mon Ami Gabi, Las Vegas",
    story: "The meal I have made every Christmas Eve since I took a cooking class with the chef at Mon Ami Gabi in Las Vegas. It takes a while, but it is so worth it. Everyone at the table looks forward to it all year long.",
    meta: [
      { k: "Yields", v: "6 servings" },
      { k: "Oven", v: "250 to 325°" },
      { k: "Braise", v: "about 5.5 hr" },
    ],
    ingredientGroups: [
      {
        heading: "Lamb rub",
        items: [
          "1 cup kosher salt",
          "1/4 cup cracked black pepper",
          "1/2 cup fennel seeds",
          "1 1/2 cups sugar",
        ],
      },
      {
        heading: "Lamb shanks",
        items: [
          "6 lamb shanks",
          "3 tbsp lamb rub",
          "1 cup plum tomato, chopped",
          "1 cup fennel, julienned",
          "1 1/2 cups onions, julienned",
          "2 tbsp garlic cloves, crushed",
          "2 cups white wine",
          "2 tbsp flour",
          "2 lemons, quartered",
          "Up to 64 oz beef stock",
        ],
      },
      {
        heading: "Orzo & goat cheese",
        items: [
          "4 cups cooked orzo",
          "3/4 cup reserved pasta water",
          "2 tsp ground fennel",
          "4 tbsp preserved lemon (or 2 tsp lemon zest)",
          "8 tbsp pitted black Nicoise olives",
          "6 oz crumbled goat cheese",
          "4 tsp chopped parsley",
        ],
      },
      {
        heading: "Garnish",
        items: [
          "Parsley",
          "Red and yellow cherry tomatoes, halved",
          "Extra ground fennel and lamb rub",
        ],
      },
    ],
    steps: [
      "Make the rub: grind the fennel seeds and combine with the remaining rub ingredients.",
      "Rub the lamb shanks and let sit at least 30 minutes (I do this the day before and refrigerate overnight).",
      "Preheat oven to a low 250 to 275°, no higher than 325°.",
      "Sear the shanks in a heavy braising pan until deeply browned on all sides, then remove.",
      "In the same pan, saute the plum tomato, fennel, onions, and garlic until golden. Season with a light sprinkling of rub.",
      "Add the lemon and sprinkle with the flour. Cook a few minutes.",
      "Deglaze with the white wine until the vegetables are covered, then reduce to a syrup. Take your time here for deeper flavor.",
      "Return the shanks to the pan and add beef stock until nearly covered.",
      "Cut a round of parchment to cover the surface of the liquid, then cover the pan with foil and a lid.",
      "Braise in the oven about 5.5 hours, until tender.",
      "When the shanks are nearly ready, cook the orzo and reserve 3/4 cup pasta water. In a large saute pan, combine the orzo, pasta water, ground fennel, lemon, olives, goat cheese, and parsley and warm until just heated through.",
      "Mound the orzo in each pasta bowl and top with a shank, bone side up. Stir a little parsley into the pan juices, adjust seasoning, and spoon over the shanks.",
      "Finish each bowl with halved cherry tomatoes, parsley, and a touch of ground fennel or rub. Serve.",
    ],
  },
  {
    id: "crack-burgers",
    title: "Crack Burgers",
    category: "Mains",
    source: "Kimberly Schlapman's recipe",
    story: "Kimberly Schlapman's famous sliders, the ones she calls 'crack' burgers. Cheesy, savory, steamy little Hawaiian rolls that disappear in minutes.",
    meta: [
      { k: "Yields", v: "12 sliders" },
      { k: "Bake", v: "8 to 10 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "12 Hawaiian rolls",
          "1 lb ground beef",
          "8 oz grated cheddar",
          "1/4 to 1/3 cup mayonnaise",
          "1 packet onion soup mix",
          "Dash of Worcestershire sauce",
          "Salt and pepper, to taste",
        ],
      },
    ],
    steps: [
      "Brown the beef in a deep skillet and drain off the fat.",
      "Add the onion soup mix, Worcestershire, mayo (start with 1/4 cup), and cheddar. Mix until spreadable, adding a tablespoon of mayo at a time if it seems dry.",
      "Slice the rolls in half. Spread a hefty scoop of the burger mix on each bottom and replace the tops.",
      "Cover with foil in a 9x13 dish and steam at 350° for 8 to 10 minutes.",
    ],
  },
  {
    id: "broccoli-taco-bowl",
    title: "Broccoli Taco Bowl",
    category: "Mains",
    source: "from SMR",
    story: "A fast, lean skillet bowl: seasoned beef and broccoli finished with melty cheddar. It comes together in about fifteen minutes.",
    note: "Per serving = 1 lean, 3 greens, 2 condiments.",
    meta: [
      { k: "Yields", v: "2 bowls" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "8 oz lean ground beef",
          "2 oz shredded cheddar",
          "2 1/2 cups broccoli, cut into bite-sized pieces",
          "1/2 cup Rotel tomatoes",
          "1/2 tsp garlic powder",
          "1/2 tsp onion powder",
          "1/2 tsp salt, divided",
          "Pinch of red pepper flakes",
          "4 tbsp low-sodium chicken stock",
        ],
      },
    ],
    steps: [
      "Put the broccoli in a bowl with the chicken stock, cover with plastic wrap, and microwave 4 minutes, until tender.",
      "In a large skillet, brown the beef and drain the grease if needed.",
      "Add the Rotel tomatoes, garlic powder, onion powder, salt, and red pepper flakes and stir well.",
      "Add the cooked broccoli to the skillet and toss with the beef mixture.",
      "Spoon into bowls and top with the shredded cheddar.",
    ],
  },

  // ── BREAKFAST & BREADS ───────────────────────────────────────────────────
  {
    id: "brunch-bake",
    title: "Brunch Bake",
    category: "Breakfast & Breads",
    source: "adapted from The Big Book of Breakfast",
    story: "My go-to when I have overnight company, because it is made ahead and you just pop it in the oven in the morning. You have probably had it at the lake!",
    meta: [
      { k: "Yields", v: "12 servings" },
      { k: "Bake", v: "40 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "2 tbsp butter or margarine",
          "8 oz medium mushrooms, sliced",
          "10 green onions, sliced",
          "12 large eggs",
          "1 cup milk",
          "1/4 cup all-purpose flour",
          "1/2 tsp baking powder",
          "3 cups grated Monterey Jack",
          "1 cup diced cooked ham",
          "1/2 tsp salt",
          "Freshly ground pepper",
          "2 cans (7 oz) chopped green chiles",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350°.",
      "Melt the butter over medium heat. Add the mushrooms and green onions and saute about 5 minutes until tender.",
      "Whisk together the eggs, milk, flour, and baking powder. Stir in the cheese, ham, salt, pepper, and the mushroom mixture.",
      "Arrange the chiles on the bottom of a sprayed 9x13 dish and pour the egg mixture over them.",
      "Bake uncovered about 40 minutes, until set. Let stand 10 minutes, then cut into squares.",
    ],
  },
  {
    id: "banana-bread",
    title: "Banana Bread",
    category: "Breakfast & Breads",
    source: "adapted from The Big Book of Breakfast",
    story: "Use very ripe bananas for this moist, super-buttery loaf. We love it spread with cream cheese or lemon curd. It freezes very well.",
    meta: [
      { k: "Yields", v: "1 loaf" },
      { k: "Bake", v: "55 to 60 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1/3 cup melted butter or margarine",
          "1 cup sugar",
          "2 large eggs",
          "1 to 1 1/2 cups mashed ripe bananas (3 or 4)",
          "1/3 cup water",
          "1 2/3 cups all-purpose flour",
          "1 tsp baking soda",
          "1/4 tsp baking powder",
          "1/2 tsp salt",
          "1/2 cup chopped walnuts or other nuts",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350°.",
      "Beat the butter and sugar. Add the eggs, bananas, and water and beat 30 seconds. Add the flour, baking soda, baking powder, and salt and mix until blended. Stir in the nuts if using.",
      "Pour into a lightly greased loaf pan.",
      "Bake 55 to 60 minutes, until a toothpick comes out clean.",
      "Cool in the pan 10 minutes, then turn out. Wrap in foil to store once cool.",
    ],
  },
  {
    id: "easy-sticky-buns",
    title: "Easy Sticky Buns",
    category: "Breakfast & Breads",
    source: "adapted from Ina Garten",
    story: "Inspired by Ina Garten. I made these one weekend at the lake to go with my breakfast casserole, easy and delicious.",
    meta: [
      { k: "Yields", v: "12 buns" },
      { k: "Prep", v: "30 min" },
      { k: "Bake", v: "30 min" },
    ],
    ingredientGroups: [
      {
        heading: "Pan & topping",
        items: [
          "12 tbsp (1 1/2 sticks) unsalted butter, room temperature",
          "1/3 cup light brown sugar, packed",
          "1/2 cup pecans, in large pieces",
          "1 package (17.3 oz / 2 sheets) frozen puff pastry, thawed",
        ],
      },
      {
        heading: "Filling",
        items: [
          "2 tbsp unsalted butter, melted and cooled",
          "2/3 cup light brown sugar, packed",
          "3 tsp ground cinnamon",
          "1 cup raisins",
        ],
      },
    ],
    steps: [
      "Preheat oven to 400°. Set a 12-cup muffin tin on a parchment-lined sheet pan.",
      "Cream the 12 tablespoons butter with 1/3 cup brown sugar. Place a rounded tablespoon in each muffin cup and divide the pecans on top.",
      "On a floured surface, unfold one pastry sheet and brush with melted butter. Leaving a 1-inch border, sprinkle with 1/3 cup brown sugar, 1 1/2 teaspoons cinnamon, and 1/2 cup raisins. Roll up snugly like a jelly roll, trim the ends, and slice into 6 pieces. Set spiral-side up in the cups. Repeat with the second sheet.",
      "Bake 30 minutes, until golden to dark brown and firm. Cool 5 minutes, then invert onto the parchment, easing the filling and pecans onto the buns, and cool.",
    ],
  },

  // ── DESSERTS ─────────────────────────────────────────────────────────────
  {
    id: "cocomints",
    title: "Cocomints",
    category: "Desserts",
    source: "a Blose family favorite",
    story: "A Christmas mainstay made from a card in the Blose family kitchen for as long as I can remember. Kate, my mom, and I make a batch together every year, and I have handed this recipe to more people than I can count. A cookie press gives them their classic shape, but piped or spooned rounds work too.",
    note: "From the handwritten card, so double-check the cocoa as you go. A Super Shooter cookie press is traditional.",
    meta: [
      { k: "Yields", v: "3 1/2 dozen" },
      { k: "Oven", v: "325°" },
      { k: "Bake", v: "10 min" },
    ],
    ingredientGroups: [
      {
        heading: "Cookies",
        items: [
          "3/4 cup butter or margarine",
          "1 cup granulated sugar",
          "1 egg",
          "1/2 tsp vanilla",
          "2 cups flour",
          "3/4 cup cocoa powder",
          "1 tsp baking powder",
          "1/2 tsp baking soda",
          "1/2 tsp salt",
          "1/2 cup milk",
        ],
      },
      {
        heading: "Mint filling",
        items: [
          "3 tbsp butter or margarine",
          "1 1/2 cups powdered sugar",
          "1 tbsp milk",
          "2 to 3 drops green food coloring",
          "1 to 2 drops peppermint extract",
        ],
      },
    ],
    steps: [
      "Cream the butter and granulated sugar until fluffy. Add the egg and vanilla and beat well.",
      "Sift together the flour, cocoa, baking powder, baking soda, and salt. Add to the creamed mixture alternately with the milk, mixing well.",
      "Form cookies with a cookie press, refrigerating the dough if needed. Bake on ungreased sheets at 325° for 10 minutes. Remove from the sheets immediately and cool.",
      "For the filling, combine the butter, powdered sugar, milk, food coloring, and peppermint extract until smooth.",
      "When the cookies are cool, sandwich them together with the mint filling.",
    ],
  },
  {
    id: "easy-chocolate-trifle",
    title: "Easy Chocolate Trifle",
    category: "Desserts",
    source: "adapted from kraftfoods.com",
    story: "Layers of chocolate cake, pudding, whipped cream, and toffee. Easy, feeds a crowd, and everyone loves chocolate and whipped cream.",
    note: "No toffee? Use any candy bar you like.",
    meta: [
      { k: "Yields", v: "18 servings" },
      { k: "Prep", v: "50 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 box chocolate cake mix (2-layer size)",
          "1 quart (4 cups) cold milk",
          "2 packages chocolate instant pudding (4-serving size each)",
          "1 tub (8 oz) whipped topping, thawed",
          "4 chocolate-covered toffee bars (1.4 oz each), crushed",
        ],
      },
    ],
    steps: [
      "Bake the cake in a 13x9 pan as directed. Cool completely and cut into 1/2-inch cubes.",
      "Whisk the milk into the dry pudding mix for 2 minutes until blended.",
      "In a large glass trifle bowl, layer half each of the cake cubes, pudding, whipped topping, and crushed toffee. Repeat. Serve, or cover and refrigerate until ready.",
    ],
  },
  {
    id: "decadent-triple-layer-mud-pie",
    title: "Decadent Triple Layer Mud Pie",
    category: "Desserts",
    source: "adapted from kraftfoods.com",
    story: "No baking, delicious, and it feeds a crowd, my three dinner-party dessert requirements. Once I found this, I always volunteered to bring dessert.",
    meta: [
      { k: "Yields", v: "10 servings" },
      { k: "Prep", v: "15 min" },
      { k: "Chill", v: "3 hr" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "3 squares semi-sweet baking chocolate, melted",
          "1/4 cup sweetened condensed milk",
          "1 Oreo pie crust (6 oz)",
          "Pecans, optional",
          "2 cups cold milk",
          "2 packages chocolate instant pudding (4-serving size each)",
          "1 tub (8 oz) whipped topping, thawed",
        ],
      },
    ],
    steps: [
      "Whisk the melted chocolate and condensed milk until blended. Pour into the crust and sprinkle with pecans if using.",
      "Whisk the cold milk into the pudding mixes for 2 minutes (it will be thick). Spoon 1 1/2 cups over the crust.",
      "Stir half the whipped topping into the remaining pudding and spread over the pie. Top with the rest of the whipped topping. Refrigerate 3 hours.",
    ],
  },
  {
    id: "mocha-cake",
    title: "Mocha Cake",
    category: "Desserts",
    source: "adapted from Southern Living",
    story: "A crowd-pleaser. The bundt makes it beautiful, and the chocolate and coffee liqueur make it delicious. We usually just dust it with powdered sugar.",
    meta: [
      { k: "Yields", v: "one 10-inch cake" },
      { k: "Prep", v: "25 min" },
      { k: "Bake", v: "50 to 55 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "2 cups sour cream",
          "2 large eggs",
          "1 box chocolate cake mix (18.25 oz)",
          "1/2 cup coffee liqueur",
          "1/4 cup vegetable oil",
          "1 package (12 oz) semisweet chocolate morsels",
          "1/2 cup crushed almond brickle chips, optional",
          "Powdered sugar, to finish",
          "1 pint whipping cream, optional",
          "1/4 cup powdered sugar, optional",
        ],
      },
    ],
    steps: [
      "Stir together the first five ingredients until well blended. Stir in the morsels and brickle chips if using. Pour into a greased and floured 10-inch bundt pan.",
      "Bake at 350° for 50 to 55 minutes, until a pick comes out clean. Cool in the pan 10 to 15 minutes, turn out, and cool completely. Dust with powdered sugar.",
      "For whipped cream, beat the cream to foamy, gradually add 1/4 cup powdered sugar, and beat to soft peaks. Serve alongside.",
    ],
  },
  {
    id: "california-almond-cake",
    title: "California Almond Cake",
    category: "Desserts",
    source: "adapted from cookingwithruthie.com",
    story: "I found this in People magazine, of all places, and it makes a DELICIOUS cake. It is especially good a day or two after baking. The recipe comes from the executive pastry chef at the Beverly Hilton, served to celebrities at the Golden Globes.",
    meta: [
      { k: "Yields", v: "one 9-inch cake" },
      { k: "Prep", v: "15 min" },
      { k: "Bake", v: "1 hr 20 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "16 oz almond paste",
          "1 cup butter, softened",
          "1 3/4 cups sugar",
          "1/3 cup triple sec or Grand Marnier",
          "3 large eggs",
          "1 cup all-purpose flour",
          "1 tsp baking powder",
          "Powdered sugar and sliced almonds, to finish",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350°. In a stand mixer with the paddle, cream the almond paste, butter, and sugar on medium-high for 2 minutes.",
      "Reduce to medium-low and slowly add the triple sec and eggs. Do not overmix.",
      "Sift together the flour and baking powder, then add and mix only until just blended.",
      "Pour into a greased and floured 9-inch springform pan. Bake 45 minutes, then cover with foil and bake another 30 to 35 minutes.",
      "Cool in the pan, turn out, and finish with sliced almonds and a dusting of powdered sugar.",
    ],
  },
  {
    id: "grandma-bertschy-s-pumpkin-pie",
    title: "Grandma Bertschy's Pumpkin Pie",
    category: "Desserts",
    source: "from Kitty Blose & Dorothy Bertschy",
    story: "The famous pumpkin pie with pecan praline at the bottom. We have had this every year of my life, and it always makes me think of Grandma Bertschy and my mom when I make it.",
    note: "Do not freeze the pie; it separates the crust from the filling. 3 1/2 tsp pumpkin pie spice can stand in for the cinnamon, ginger, and cloves.",
    meta: [
      { k: "Yields", v: "2 nine-inch pies" },
      { k: "Prep", v: "20 min" },
      { k: "Bake", v: "1 hr 5 min" },
    ],
    ingredientGroups: [
      {
        heading: "Pecan praline",
        items: [
          "1/4 cup butter, softened and cut small",
          "1 cup pecans, finely chopped",
          "1 cup packed brown sugar",
        ],
      },
      {
        heading: "Pie filling",
        items: [
          "1 1/2 cups sugar",
          "1 tsp salt, optional",
          "2 tsp ground cinnamon",
          "1 tsp ground ginger",
          "1/2 tsp ground cloves",
          "4 large eggs",
          "1 can (20 oz) pure pumpkin",
          "2 cans (12 oz) evaporated milk",
          "2 unbaked 9-inch deep dish crusts",
        ],
      },
    ],
    steps: [
      "Preheat oven to 425°. Set the crusts on a rimmed baking sheet and poke the bottoms with a fork.",
      "Combine the butter, pecans, and brown sugar with a fork until crumbly. Spread evenly in the crusts and bake 5 to 10 minutes until melted, then remove.",
      "Mix the sugar, salt, cinnamon, ginger, and cloves. Beat the eggs in a large bowl, stir in the pumpkin and spice mixture, then gradually stir in the evaporated milk.",
      "Pour into the crusts. Bake 15 minutes, reduce to 350°, and bake 40 to 50 minutes until a knife in the center comes out clean. Cool 2 hours.",
    ],
  },
  {
    id: "chess-squares",
    title: "Chess Squares",
    category: "Desserts",
    source: "from a college roommate's mom",
    story: "Gooey, buttery squares from my college roommate's mom. Always a hit.",
    meta: [
      { k: "Yields", v: "15 servings" },
      { k: "Prep", v: "10 min" },
      { k: "Bake", v: "30 min" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 box yellow cake mix (18.5 oz), without pudding",
          "1/2 cup butter, softened",
          "1 egg, beaten",
          "1 package (8 oz) cream cheese, softened",
          "2 eggs",
          "2 1/2 cups powdered sugar",
          "1 tsp vanilla extract",
        ],
      },
    ],
    steps: [
      "Preheat oven to 350° and spray a 9x13 pan.",
      "Combine the cake mix, butter, and beaten egg. Press into the pan and bake 10 minutes.",
      "Beat the cream cheese until fluffy. Add the eggs one at a time, then gradually beat in the powdered sugar. Stir in the vanilla. Pour over the baked layer and spread evenly.",
      "Bake 25 to 35 minutes until browned. Cool and cut into squares.",
    ],
  },

  // ── DRINKS ───────────────────────────────────────────────────────────────
  {
    id: "the-big-pour-garden-party",
    title: "The Big Pour: Garden Party",
    category: "Drinks",
    source: "",
    story: "A bright, floral punch built for a crowd. Pour it all into a big bowl and let everyone help themselves.",
    meta: [
      { k: "Yields", v: "1 punch bowl" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "1 bottle prosecco",
          "1/3 jug lemonade",
          "1/2 jug white cranberry juice",
          "1/2 cup elderflower cordial",
          "1 carton raspberry sorbet",
        ],
      },
    ],
    steps: [
      "Pour everything into a punch bowl. Garnish with mint and lemon slices, and enjoy.",
    ],
  },
  {
    id: "tully-spritz",
    title: "Tully Spritz",
    category: "Drinks",
    source: "",
    story: "Strawberry, lime, elderflower, and prosecco. So flippin good. The amounts are to taste, build it the way you like it.",
    note: "Measurements to taste.",
    meta: [
      { k: "Serves", v: "1, easily multiplied" },
    ],
    ingredientGroups: [
      {
        heading: "Ingredients",
        items: [
          "Strawberry puree",
          "Lime juice",
          "Elderflower liqueur",
          "Prosecco",
        ],
      },
    ],
    steps: [
      "Build over ice: strawberry puree and a squeeze of lime, a pour of elderflower liqueur, then top with prosecco. Stir gently.",
    ],
  },
];
