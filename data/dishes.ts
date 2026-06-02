export const DISHES = [
  {
    id: "huevos-carne",
    name_es: "Huevos con carne molida",
    name_en: "Eggs with ground beef",
    image_url: "/dishes/huevos-carne.svg",
    diet_tags: ["carnivore_flexible", "carnivore_strict", "keto_carnivore"],
    calories: 520,
    protein_g: 55,
    carbs_g: 2,
    fat_g: 34,
    total_minutes: 18,
    prep_minutes: 5,
    cook_minutes: 13,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "200 g de carne molida",
      "2 huevos",
      "1 cucharadita de mantequilla o grasa de res",
      "Sal al gusto"
    ],
    ingredients_en: [
      "200 g ground beef",
      "2 eggs",
      "1 tsp butter or beef tallow",
      "Salt to taste"
    ],
    utensils_es: [
      "Sartén",
      "Olla pequeña",
      "Espátula",
      "Tupper si lo llevarás al trabajo"
    ],
    utensils_en: [
      "Pan",
      "Small pot",
      "Spatula",
      "Meal-prep container if taking to work"
    ],
    steps_es: [
      "Llena una olla pequeña con agua suficiente para cubrir los huevos y ponla a fuego alto.",
      "Cuando el agua hierva, agrega los huevos con cuidado y cocina 10 a 12 minutos.",
      "Mientras los huevos se cuecen, calienta un sartén a fuego medio y agrega la mantequilla o grasa.",
      "Agrega la carne molida, separándola con la espátula para que no queden bolas grandes.",
      "Añade sal y cocina la carne 8 a 10 minutos, moviendo cada 2 minutos hasta que ya no se vea rosa.",
      "Cuando los huevos estén listos, pásalos a agua fría 2 minutos para pelarlos más fácil.",
      "Sirve la carne con los huevos partidos a la mitad o guarda en tupper si será comida de trabajo."
    ],
    tips_es: [
      "Mientras se cuecen los huevos, aprovecha para cocinar la carne y preparar el tupper.",
      "Si lo llevarás al trabajo, deja enfriar la carne 8 minutos antes de cerrar el tupper para que no suelte tanto vapor.",
      "Puedes cocinar doble carne y guardar una porción para otra comida del turno.",
      "Si vas apurado, usa huevos ya cocidos preparados desde el día anterior."
    ],
    steps_en: [
      "Fill a small pot with enough water to cover the eggs and bring it to a boil.",
      "Once boiling, carefully add the eggs and cook for 10 to 12 minutes.",
      "While the eggs cook, heat a pan over medium heat and add butter or tallow.",
      "Add the ground beef and break it apart with a spatula.",
      "Add salt and cook for 8 to 10 minutes, stirring every 2 minutes until no pink remains.",
      "Move the eggs to cold water for 2 minutes so they peel more easily.",
      "Serve the beef with halved eggs or pack it in a container for work."
    ],
    tips_en: [
      "While the eggs boil, cook the beef and prepare your container.",
      "If taking it to work, let the beef cool for 8 minutes before closing the container.",
      "Cook double beef and save one serving for another work meal.",
      "Use pre-boiled eggs if you are in a rush."
    ],
    shopping_items: [
      { name: "Carne molida", amount: 200, unit: "g" },
      { name: "Huevos", amount: 2, unit: "piezas" },
      { name: "Mantequilla o grasa de res", amount: 1, unit: "cucharadita" },
      { name: "Sal", amount: 1, unit: "al gusto" }
    ],
    replacements_es: [
      "Bistec picado",
      "Pollo deshebrado",
      "Carne para hamburguesa sin pan",
      "Atún con huevo cocido"
    ],
    replacements_en: [
      "Chopped steak",
      "Shredded chicken",
      "Bunless burger patties",
      "Tuna with boiled eggs"
    ]
  },
  {
    id: "bistec-huevos",
    name_es: "Bistec con huevos",
    name_en: "Steak and eggs",
    image_url: "/dishes/bistec-huevos.svg",
    diet_tags: ["carnivore_strict", "carnivore_flexible", "keto_carnivore"],
    calories: 650,
    protein_g: 62,
    carbs_g: 1,
    fat_g: 44,
    total_minutes: 20,
    prep_minutes: 5,
    cook_minutes: 15,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "220 g de bistec",
      "2 huevos",
      "Sal al gusto",
      "1 cucharadita de mantequilla o grasa"
    ],
    ingredients_en: [
      "220 g steak",
      "2 eggs",
      "Salt to taste",
      "1 tsp butter or tallow"
    ],
    utensils_es: [
      "Sartén",
      "Pinzas",
      "Espátula",
      "Tupper si es para llevar"
    ],
    utensils_en: [
      "Pan",
      "Tongs",
      "Spatula",
      "Meal-prep container"
    ],
    steps_es: [
      "Saca el bistec del refrigerador 5 minutos antes para que no esté tan frío al cocinarlo.",
      "Seca el bistec con servilleta, agrega sal por ambos lados y calienta el sartén a fuego medio-alto.",
      "Agrega la mantequilla o grasa y coloca el bistec en el sartén.",
      "Cocina 3 a 5 minutos por lado, dependiendo del grosor y del término que prefieras.",
      "Retira el bistec y déjalo reposar 3 minutos en un plato.",
      "En el mismo sartén, baja a fuego medio y cocina los huevos 3 a 4 minutos.",
      "Sirve los huevos sobre el bistec o guarda separado si lo llevarás al trabajo."
    ],
    tips_es: [
      "Mientras el bistec reposa, cocina los huevos usando el mismo sartén para ahorrar tiempo y lavar menos.",
      "Si lo llevarás en tupper, corta el bistec en tiras antes de guardarlo para que sea más fácil comerlo en el break.",
      "No cierres el tupper inmediatamente si el bistec está muy caliente; espera unos minutos para evitar vapor."
    ],
    steps_en: [
      "Take the steak out of the fridge 5 minutes before cooking.",
      "Pat it dry, salt both sides, and heat a pan over medium-high heat.",
      "Add butter or tallow and place the steak in the pan.",
      "Cook 3 to 5 minutes per side depending on thickness and doneness.",
      "Remove the steak and let it rest for 3 minutes.",
      "In the same pan, lower heat to medium and cook the eggs for 3 to 4 minutes.",
      "Serve eggs over steak or pack separately for work."
    ],
    tips_en: [
      "Cook the eggs while the steak rests to save time.",
      "Slice steak before packing so it is easier to eat at work.",
      "Let it cool a few minutes before closing the container."
    ],
    shopping_items: [
      { name: "Bistec", amount: 220, unit: "g" },
      { name: "Huevos", amount: 2, unit: "piezas" },
      { name: "Mantequilla o grasa", amount: 1, unit: "cucharadita" },
      { name: "Sal", amount: 1, unit: "al gusto" }
    ],
    replacements_es: [
      "Carne molida",
      "Chuleta de cerdo",
      "Pollo dorado",
      "Hamburguesas sin pan"
    ],
    replacements_en: [
      "Ground beef",
      "Pork chop",
      "Seared chicken",
      "Bunless burgers"
    ]
  },
  {
    id: "pollo-mantequilla",
    name_es: "Pollo dorado con mantequilla",
    name_en: "Butter seared chicken",
    image_url: "/dishes/pollo-mantequilla.svg",
    diet_tags: ["carnivore_flexible", "keto_carnivore"],
    calories: 520,
    protein_g: 58,
    carbs_g: 1,
    fat_g: 29,
    total_minutes: 22,
    prep_minutes: 5,
    cook_minutes: 17,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "220 g de pechuga o muslo de pollo",
      "1 cucharada de mantequilla",
      "Sal al gusto",
      "Pimienta opcional si tu dieta la permite"
    ],
    ingredients_en: [
      "220 g chicken breast or thigh",
      "1 tbsp butter",
      "Salt to taste",
      "Pepper optional if allowed"
    ],
    utensils_es: [
      "Sartén con tapa",
      "Pinzas",
      "Tabla para cortar",
      "Tupper"
    ],
    utensils_en: [
      "Pan with lid",
      "Tongs",
      "Cutting board",
      "Container"
    ],
    steps_es: [
      "Corta el pollo en tiras gruesas para que se cocine más rápido y parejo.",
      "Agrega sal por ambos lados.",
      "Calienta el sartén a fuego medio y derrite la mantequilla.",
      "Coloca el pollo en el sartén y cocina 5 a 6 minutos por lado.",
      "Si las piezas son gruesas, tapa el sartén 3 a 4 minutos para terminar la cocción por dentro.",
      "Revisa que el pollo no esté rosado por dentro.",
      "Deja reposar 3 minutos antes de cortar o guardar."
    ],
    tips_es: [
      "Mientras el pollo se cocina, prepara el tupper, servilletas y cubiertos para el trabajo.",
      "Si vas a recalentarlo, agrega una cucharadita de mantequilla extra al tupper para que no quede seco.",
      "Puedes hacer doble porción y usar una parte al día siguiente en el break."
    ],
    steps_en: [
      "Cut chicken into thick strips so it cooks faster and evenly.",
      "Salt both sides.",
      "Heat pan over medium heat and melt butter.",
      "Cook chicken 5 to 6 minutes per side.",
      "If pieces are thick, cover the pan for 3 to 4 minutes to finish inside.",
      "Make sure chicken is no longer pink inside.",
      "Rest 3 minutes before cutting or packing."
    ],
    tips_en: [
      "While chicken cooks, prepare your container, napkins and utensils.",
      "Add a small amount of butter when packing so it does not dry out.",
      "Cook double and use one portion for the next work break."
    ],
    shopping_items: [
      { name: "Pollo", amount: 220, unit: "g" },
      { name: "Mantequilla", amount: 1, unit: "cucharada" },
      { name: "Sal", amount: 1, unit: "al gusto" }
    ],
    replacements_es: [
      "Carne molida",
      "Bistec",
      "Atún con huevos",
      "Camarones con mantequilla"
    ],
    replacements_en: [
      "Ground beef",
      "Steak",
      "Tuna with eggs",
      "Butter shrimp"
    ]
  },
  {
    id: "atun-huevos",
    name_es: "Atún con huevos cocidos",
    name_en: "Tuna with boiled eggs",
    image_url: "/dishes/atun-huevos.svg",
    diet_tags: ["carnivore_strict", "carnivore_flexible"],
    calories: 430,
    protein_g: 52,
    carbs_g: 1,
    fat_g: 22,
    total_minutes: 14,
    prep_minutes: 2,
    cook_minutes: 12,
    portable: true,
    needs_microwave: false,
    good_cold: true,
    ingredients_es: [
      "1 lata de atún en agua",
      "2 huevos",
      "Sal al gusto",
      "Mayonesa opcional si tu dieta la permite"
    ],
    ingredients_en: [
      "1 can tuna in water",
      "2 eggs",
      "Salt to taste",
      "Mayo optional if allowed"
    ],
    utensils_es: [
      "Olla pequeña",
      "Abrelatas",
      "Tenedor",
      "Tupper"
    ],
    utensils_en: [
      "Small pot",
      "Can opener",
      "Fork",
      "Container"
    ],
    steps_es: [
      "Pon los huevos en una olla con agua y hierve 10 a 12 minutos.",
      "Mientras se cuecen, abre la lata de atún y escurre el agua.",
      "Coloca el atún en un bowl o tupper y sepáralo con un tenedor.",
      "Cuando los huevos estén listos, pásalos a agua fría 2 minutos.",
      "Pela los huevos, córtalos en trozos y mézclalos con el atún.",
      "Agrega sal y, si la usas, una pequeña cantidad de mayonesa.",
      "Guarda en tupper cerrado y mantenlo frío si lo llevarás al trabajo."
    ],
    tips_es: [
      "Este plato es ideal si no tienes microondas en el trabajo.",
      "Puedes cocer varios huevos desde antes y ahorrar 10 minutos en la mañana.",
      "Lleva una cuchara o tenedor extra en la bolsa para no depender del trabajo."
    ],
    steps_en: [
      "Boil eggs for 10 to 12 minutes.",
      "While they cook, open and drain the tuna.",
      "Place tuna in a bowl or container and break it apart with a fork.",
      "Move eggs to cold water for 2 minutes.",
      "Peel and chop eggs, then mix with tuna.",
      "Add salt and optional mayo if allowed.",
      "Keep cold if taking to work."
    ],
    tips_en: [
      "Great option if you do not have a microwave at work.",
      "Boil several eggs ahead of time to save 10 minutes.",
      "Pack a fork so you are not stuck at work without utensils."
    ],
    shopping_items: [
      { name: "Atún", amount: 1, unit: "lata" },
      { name: "Huevos", amount: 2, unit: "piezas" },
      { name: "Sal", amount: 1, unit: "al gusto" },
      { name: "Mayonesa opcional", amount: 1, unit: "cucharadita" }
    ],
    replacements_es: [
      "Sardinas con huevo",
      "Pollo frío deshebrado",
      "Huevos con carne",
      "Yogurt griego si es para perfil vegetariano"
    ],
    replacements_en: [
      "Sardines with eggs",
      "Cold shredded chicken",
      "Eggs with beef",
      "Greek yogurt for vegetarian profile"
    ]
  },
  {
    id: "yogurt-nueces",
    name_es: "Yogurt griego con nueces",
    name_en: "Greek yogurt with nuts",
    image_url: "/dishes/yogurt-nueces.svg",
    diet_tags: ["lacto_ovo_vegetarian", "lacto_vegetarian"],
    calories: 360,
    protein_g: 28,
    carbs_g: 22,
    fat_g: 18,
    total_minutes: 5,
    prep_minutes: 5,
    cook_minutes: 0,
    portable: true,
    needs_microwave: false,
    good_cold: true,
    ingredients_es: [
      "1 taza de yogurt griego natural sin azúcar",
      "20 g de nueces",
      "Canela al gusto",
      "Berries opcionales"
    ],
    ingredients_en: [
      "1 cup plain unsweetened Greek yogurt",
      "20 g nuts",
      "Cinnamon to taste",
      "Optional berries"
    ],
    utensils_es: [
      "Bowl",
      "Cuchara",
      "Tupper pequeño si es para llevar"
    ],
    utensils_en: [
      "Bowl",
      "Spoon",
      "Small container if taking to work"
    ],
    steps_es: [
      "Coloca el yogurt griego en un bowl o tupper.",
      "Agrega las nueces encima.",
      "Añade canela al gusto.",
      "Si usarás berries, agrégalas al final para que no suelten tanta agua.",
      "Mezcla solo al momento de comer para mantener mejor textura."
    ],
    tips_es: [
      "Compra yogurt natural sin azúcar para que se ajuste mejor a bajar de peso.",
      "Si lo llevarás al trabajo, lleva las nueces aparte y mézclalas al comer para que sigan crujientes.",
      "Sirve como snack rápido cuando no hay tiempo de cocinar."
    ],
    steps_en: [
      "Place Greek yogurt in a bowl or container.",
      "Add nuts on top.",
      "Add cinnamon to taste.",
      "Add berries last if using them.",
      "Mix right before eating for best texture."
    ],
    tips_en: [
      "Use plain unsweetened yogurt for weight-loss goals.",
      "Pack nuts separately so they stay crunchy.",
      "Works as a quick snack when there is no time to cook."
    ],
    shopping_items: [
      { name: "Yogurt griego natural", amount: 1, unit: "taza" },
      { name: "Nueces", amount: 20, unit: "g" },
      { name: "Canela", amount: 1, unit: "al gusto" },
      { name: "Berries opcionales", amount: 1, unit: "porción" }
    ],
    replacements_es: [
      "Queso cottage con fruta",
      "Smoothie de proteína",
      "Huevos cocidos",
      "Avena con proteína"
    ],
    replacements_en: [
      "Cottage cheese with fruit",
      "Protein smoothie",
      "Boiled eggs",
      "Protein oatmeal"
    ]
  },
  {
    id: "lentejas-huevo",
    name_es: "Bowl de lentejas con huevo",
    name_en: "Lentil egg bowl",
    image_url: "/dishes/lentejas-huevo.svg",
    diet_tags: ["lacto_ovo_vegetarian"],
    calories: 520,
    protein_g: 32,
    carbs_g: 62,
    fat_g: 18,
    total_minutes: 25,
    prep_minutes: 8,
    cook_minutes: 17,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "1 taza de lentejas cocidas",
      "2 huevos",
      "1 taza de espinaca",
      "30 g de queso fresco o cottage opcional",
      "Sal al gusto"
    ],
    ingredients_en: [
      "1 cup cooked lentils",
      "2 eggs",
      "1 cup spinach",
      "30 g optional queso fresco or cottage cheese",
      "Salt to taste"
    ],
    utensils_es: [
      "Olla pequeña",
      "Sartén",
      "Bowl",
      "Tupper"
    ],
    utensils_en: [
      "Small pot",
      "Pan",
      "Bowl",
      "Container"
    ],
    steps_es: [
      "Pon los huevos a cocer en agua hirviendo durante 10 a 12 minutos.",
      "Mientras los huevos se cuecen, calienta las lentejas en una olla pequeña a fuego medio.",
      "Agrega la espinaca a las lentejas y cocina 2 a 3 minutos hasta que se suavice.",
      "Pasa los huevos a agua fría, pélalos y córtalos en mitades.",
      "Sirve las lentejas con espinaca en un bowl.",
      "Agrega los huevos encima y queso si lo usarás.",
      "Ajusta sal y guarda en tupper si es para el trabajo."
    ],
    tips_es: [
      "Usa lentejas ya cocidas para que esta comida sea rápida.",
      "Mientras se calientan las lentejas, prepara el tupper y una cuchara para el trabajo.",
      "Si lo llevarás, deja que las lentejas bajen un poco de temperatura antes de cerrar el contenedor.",
      "Puedes preparar lentejas para 2 o 3 días y solo agregar huevo fresco."
    ],
    steps_en: [
      "Boil eggs for 10 to 12 minutes.",
      "While eggs cook, heat lentils in a small pot over medium heat.",
      "Add spinach and cook for 2 to 3 minutes until softened.",
      "Move eggs to cold water, peel and cut in halves.",
      "Serve lentils and spinach in a bowl.",
      "Top with eggs and optional cheese.",
      "Adjust salt and pack if taking to work."
    ],
    tips_en: [
      "Use cooked lentils to make this meal fast.",
      "While lentils heat, prepare your container and spoon.",
      "Let lentils cool slightly before sealing the container.",
      "Cook lentils for 2 or 3 days and add fresh eggs when needed."
    ],
    shopping_items: [
      { name: "Lentejas cocidas", amount: 1, unit: "taza" },
      { name: "Huevos", amount: 2, unit: "piezas" },
      { name: "Espinaca", amount: 1, unit: "taza" },
      { name: "Queso opcional", amount: 30, unit: "g" },
      { name: "Sal", amount: 1, unit: "al gusto" }
    ],
    replacements_es: [
      "Sopa de lentejas",
      "Burrito de frijol y huevo",
      "Quesadilla vegetariana",
      "Tofu con arroz"
    ],
    replacements_en: [
      "Lentil soup",
      "Bean and egg burrito",
      "Vegetarian quesadilla",
      "Tofu rice bowl"
    ]
  },
  {
    id: "quesadilla-veg",
    name_es: "Quesadilla vegetariana alta proteína",
    name_en: "High-protein vegetarian quesadilla",
    image_url: "/dishes/quesadilla-veg.svg",
    diet_tags: ["lacto_ovo_vegetarian", "lacto_vegetarian"],
    calories: 500,
    protein_g: 28,
    carbs_g: 42,
    fat_g: 24,
    total_minutes: 12,
    prep_minutes: 4,
    cook_minutes: 8,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "1 tortilla grande",
      "60 g de queso",
      "1/2 taza de frijoles",
      "1 taza de espinaca",
      "Salsa opcional"
    ],
    ingredients_en: [
      "1 large tortilla",
      "60 g cheese",
      "1/2 cup beans",
      "1 cup spinach",
      "Optional salsa"
    ],
    utensils_es: [
      "Sartén",
      "Espátula",
      "Cuchillo",
      "Tupper o papel aluminio"
    ],
    utensils_en: [
      "Pan",
      "Spatula",
      "Knife",
      "Container or foil"
    ],
    steps_es: [
      "Calienta el sartén a fuego medio.",
      "Coloca la tortilla en el sartén y agrega queso en la mitad.",
      "Agrega frijoles y espinaca encima del queso.",
      "Dobla la tortilla por la mitad.",
      "Cocina 3 a 4 minutos por lado hasta que el queso se derrita y la tortilla se dore.",
      "Retira del sartén y deja reposar 2 minutos antes de cortar.",
      "Corta en mitades y guarda si será comida para llevar."
    ],
    tips_es: [
      "Mientras se dora el primer lado, prepara papel aluminio o tupper.",
      "Deja reposar antes de guardar para que no se aguade con el vapor.",
      "Si es para trabajo, envuélvela en aluminio y recalienta si tienes microondas.",
      "Si quieres más proteína, acompaña con yogurt griego natural."
    ],
    steps_en: [
      "Heat pan over medium heat.",
      "Place tortilla in pan and add cheese on one half.",
      "Add beans and spinach over the cheese.",
      "Fold tortilla in half.",
      "Cook 3 to 4 minutes per side until cheese melts and tortilla browns.",
      "Rest 2 minutes before cutting.",
      "Cut in halves and pack if taking to work."
    ],
    tips_en: [
      "Prepare foil or container while the first side cooks.",
      "Let it rest before packing so steam does not make it soggy.",
      "Wrap in foil and reheat if you have a microwave.",
      "Add plain Greek yogurt on the side for more protein."
    ],
    shopping_items: [
      { name: "Tortilla grande", amount: 1, unit: "pieza" },
      { name: "Queso", amount: 60, unit: "g" },
      { name: "Frijoles", amount: 0.5, unit: "taza" },
      { name: "Espinaca", amount: 1, unit: "taza" },
      { name: "Salsa opcional", amount: 1, unit: "porción" }
    ],
    replacements_es: [
      "Burrito de frijol y huevo",
      "Bowl de lentejas",
      "Omelet vegetariano",
      "Cottage con fruta"
    ],
    replacements_en: [
      "Bean and egg burrito",
      "Lentil bowl",
      "Vegetable omelet",
      "Cottage cheese with fruit"
    ]
  },
  {
    id: "tofu-arroz",
    name_es: "Bowl de tofu con arroz",
    name_en: "Tofu rice bowl",
    image_url: "/dishes/tofu-arroz.svg",
    diet_tags: ["vegan"],
    calories: 540,
    protein_g: 28,
    carbs_g: 72,
    fat_g: 16,
    total_minutes: 25,
    prep_minutes: 8,
    cook_minutes: 17,
    portable: true,
    needs_microwave: true,
    good_cold: false,
    ingredients_es: [
      "180 g de tofu firme",
      "1 taza de arroz cocido",
      "1 taza de verduras",
      "1 cucharadita de aceite de oliva",
      "Sal o salsa baja en azúcar"
    ],
    ingredients_en: [
      "180 g firm tofu",
      "1 cup cooked rice",
      "1 cup vegetables",
      "1 tsp olive oil",
      "Salt or low-sugar sauce"
    ],
    utensils_es: [
      "Sartén",
      "Espátula",
      "Toalla de papel",
      "Tupper"
    ],
    utensils_en: [
      "Pan",
      "Spatula",
      "Paper towel",
      "Container"
    ],
    steps_es: [
      "Presiona el tofu con una toalla de papel para quitar exceso de agua.",
      "Corta el tofu en cubos medianos.",
      "Calienta el sartén con aceite a fuego medio.",
      "Agrega el tofu y cocina 8 a 10 minutos, moviendo cada 2 minutos para dorar varios lados.",
      "Mientras el tofu se dora, calienta el arroz cocido.",
      "Agrega verduras al sartén y cocina 4 a 5 minutos.",
      "Sirve el arroz con tofu y verduras encima."
    ],
    tips_es: [
      "Mientras el tofu se dora, prepara el arroz y el tupper.",
      "No muevas el tofu todo el tiempo; déjalo quieto por momentos para que dore mejor.",
      "Si lo llevarás al trabajo, guarda la salsa aparte para que no se aguade.",
      "Usa arroz ya cocido para ahorrar mucho tiempo."
    ],
    steps_en: [
      "Press tofu with paper towel to remove excess water.",
      "Cut tofu into medium cubes.",
      "Heat pan with oil over medium heat.",
      "Cook tofu for 8 to 10 minutes, stirring every 2 minutes.",
      "While tofu browns, heat cooked rice.",
      "Add vegetables and cook 4 to 5 minutes.",
      "Serve rice with tofu and vegetables on top."
    ],
    tips_en: [
      "While tofu browns, prepare rice and container.",
      "Do not move tofu constantly; let it sit to brown better.",
      "Pack sauce separately if taking to work.",
      "Use cooked rice to save time."
    ],
    shopping_items: [
      { name: "Tofu firme", amount: 180, unit: "g" },
      { name: "Arroz cocido", amount: 1, unit: "taza" },
      { name: "Verduras", amount: 1, unit: "taza" },
      { name: "Aceite de oliva", amount: 1, unit: "cucharadita" },
      { name: "Sal o salsa baja en azúcar", amount: 1, unit: "porción" }
    ],
    replacements_es: [
      "Sopa de lentejas",
      "Ensalada de garbanzos",
      "Bowl de quinoa y frijol",
      "Tempeh con verduras"
    ],
    replacements_en: [
      "Lentil soup",
      "Chickpea salad",
      "Quinoa bean bowl",
      "Tempeh with vegetables"
    ]
  },
  {
    id: "garbanzos",
    name_es: "Ensalada de garbanzos",
    name_en: "Chickpea salad",
    image_url: "/dishes/garbanzos.svg",
    diet_tags: ["vegan", "lacto_ovo_vegetarian"],
    calories: 460,
    protein_g: 20,
    carbs_g: 60,
    fat_g: 16,
    total_minutes: 12,
    prep_minutes: 12,
    cook_minutes: 0,
    portable: true,
    needs_microwave: false,
    good_cold: true,
    ingredients_es: [
      "1 taza de garbanzos cocidos",
      "1/2 pepino picado",
      "1 jitomate picado",
      "Jugo de 1/2 limón",
      "1 cucharadita de aceite de oliva",
      "Sal al gusto"
    ],
    ingredients_en: [
      "1 cup cooked chickpeas",
      "1/2 chopped cucumber",
      "1 chopped tomato",
      "Juice of 1/2 lemon",
      "1 tsp olive oil",
      "Salt to taste"
    ],
    utensils_es: [
      "Bowl",
      "Cuchillo",
      "Tabla",
      "Tupper"
    ],
    utensils_en: [
      "Bowl",
      "Knife",
      "Cutting board",
      "Container"
    ],
    steps_es: [
      "Escurre y enjuaga los garbanzos si son de lata.",
      "Pica el pepino y el jitomate en cubos pequeños.",
      "Coloca los garbanzos en un bowl.",
      "Agrega pepino, jitomate, limón, aceite y sal.",
      "Mezcla todo con cuidado.",
      "Prueba y ajusta sal o limón.",
      "Guarda en tupper si será comida fría para el trabajo."
    ],
    tips_es: [
      "Este plato es bueno si no tienes microondas.",
      "Puedes dejar el limón aparte y agregarlo al momento para que sepa más fresco.",
      "Si quieres más proteína, acompaña con yogurt griego o tofu dorado, según la dieta."
    ],
    steps_en: [
      "Drain and rinse canned chickpeas.",
      "Chop cucumber and tomato into small cubes.",
      "Place chickpeas in a bowl.",
      "Add cucumber, tomato, lemon juice, oil and salt.",
      "Mix gently.",
      "Taste and adjust salt or lemon.",
      "Pack in a container if taking to work."
    ],
    tips_en: [
      "Good option if you do not have a microwave.",
      "Pack lemon separately for fresher taste.",
      "Add Greek yogurt or tofu for more protein depending on diet."
    ],
    shopping_items: [
      { name: "Garbanzos cocidos", amount: 1, unit: "taza" },
      { name: "Pepino", amount: 0.5, unit: "pieza" },
      { name: "Jitomate", amount: 1, unit: "pieza" },
      { name: "Limón", amount: 0.5, unit: "pieza" },
      { name: "Aceite de oliva", amount: 1, unit: "cucharadita" },
      { name: "Sal", amount: 1, unit: "al gusto" }
    ],
    replacements_es: [
      "Tofu con arroz",
      "Sopa de lentejas",
      "Bowl de lentejas con huevo",
      "Cottage con fruta"
    ],
    replacements_en: [
      "Tofu rice bowl",
      "Lentil soup",
      "Lentil egg bowl",
      "Cottage cheese with fruit"
    ]
  }
] as const;