const card_categories = {
  "j-angielski-food": {
    name: "j. angielski - food",
    cards: [
      { front: "truskawka", back: "strawberry" },
      { front: "gałka muszkatołowa", back: "nutmeg" },
      { front: "jabłko", back: "apple" },
      { front: "karczoch", back: "artichoke" },
      { front: "cielęcina", back: "veal" },
    ],
  },
  "stolice-europejskie": {
    name: "stolice europejskie",
    cards: [
      { front: "Holandia", back: "Amsterdam" },
      { front: "Włochy", back: "Rzym" },
      { front: "Niemcy", back: "Berlin" },
      { front: "Węgry", back: "Budapeszt" },
      { front: "Rumunia", back: "Bukareszt" },
    ],
  },
};

export function getCategorySummaries() {
    return Object.entries(card_categories).map(([id, category]) => {
        return { id, name: category.name };
    });
}

export function hasCategory(categoryId) {
    return card_categories.hasOwnProperty(categoryId);
}

export function getCategory(categoryId) {
    if (hasCategory(categoryId))
        return { 
            id: categoryId, ...card_categories[categoryId] 
        };
    return null;
}
export function addCard(categoryId, card){
    if (hasCategory(categoryId)){ 
        card_categories[categoryId].cards.push(card);
    }
}
export function validateCardData(card){
    let errors = [];
    let fields = ["front", "back"];
    for(let field of fields){
        if(!card.hasOwnProperty(field)) errors.push(`Missing ${field}`);
        else{
            if(typeof card[field] != "string") errors.push(`${field} should be a string`);
            else{
                if (card[field].length < 1 || card[field].length > 500) errors.push(`'${field}' lenght must be between: 1-500`);
            }
        }
    }
    //sprawdza dla kazdego elementu cards z kategori czy front jest rowny ich frontu
    (card_categories[card.category_id].cards).forEach(element => {
        if(card.front == element.front){
            errors.push(`${card.front} already exists as a card front`);
        }    
    });
    return errors;
}
export default {
    getCategorySummaries,
    hasCategory,
    addCard,
    validateCardData,
    getCategory,
};