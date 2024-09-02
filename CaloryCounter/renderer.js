const { ipcRenderer } = require('electron');

document.getElementById('foodForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const foodName = document.getElementById('foodInput').value;
  const weight = document.getElementById('weightInput').value || 100;

  console.log(`Submitted food: ${foodName}, weight: ${weight}`);
  
  ipcRenderer.send('search-food', { foodName, weight });
});

ipcRenderer.on('food-result', (event, caloriesText) => {
  const resultBody = document.getElementById('resultBody');
  const weightInput = document.getElementById('weightInput').value || 100;

  console.log('Received food result:', caloriesText);
  console.log('Current weight input:', weightInput);

  // Pulisci la tabella prima di aggiungere nuovi risultati
  resultBody.innerHTML = '';

  // Rimuovi il testo "Di più..." e "Valori Nutrizionali - Simili"
  const cleanedText = caloriesText.replace(/, Di più...[\s\S]*$/, '').trim();
  console.log('Cleaned text:', cleanedText);

  // Estrai le informazioni dal testo delle calorie
  const nutritionInfo = cleanedText.split('|').map(info => info.trim());
  console.log('Extracted nutrition info:', nutritionInfo);

  // Crea un oggetto per memorizzare le informazioni nutrizionali
  let nutritionData = {
    calories: 0,
    fats: 0,
    carbs: 0,
    proteins: 0,
  };

  // Estrai i valori nutrizionali
  nutritionInfo.forEach(info => {
    const [label, value] = info.split(':');
    const numericValue = parseFloat(value);
    console.log(`Parsing info: label=${label}, value=${numericValue}`);

    if (label.includes('Calorie')) {
      nutritionData.calories = numericValue;
    } else if (label.includes('Gras')) {
      nutritionData.fats = numericValue;
    } else if (label.includes('Carb')) {
      nutritionData.carbs = numericValue;
    } else if (label.includes('Prot')) {
      nutritionData.proteins = numericValue;
    }
  });

  console.log('Nutrition data before adjustment:', nutritionData);

  // Aggiusta i valori nutrizionali in base al peso
  const adjustedData = adjustNutritionByWeight(nutritionData, weightInput);

  console.log('Adjusted nutrition data:', adjustedData);

  // Visualizza i risultati
  displayResults(adjustedData);
});

document.getElementById('weightInput').addEventListener('input', () => {
  const weightInput = document.getElementById('weightInput').value || 100;
  const resultBody = document.getElementById('resultBody');

  console.log('Weight input changed:', weightInput);

  if (resultBody.rows.length > 0) {
    let nutritionData = {
      calories: parseFloat(resultBody.rows[0].cells[1].textContent),
      fats: parseFloat(resultBody.rows[1].cells[1].textContent),
      carbs: parseFloat(resultBody.rows[2].cells[1].textContent),
      proteins: parseFloat(resultBody.rows[3].cells[1].textContent),
    };

    console.log('Current displayed nutrition data:', nutritionData);

    const adjustedData = adjustNutritionByWeight(nutritionData, weightInput);
    console.log('Re-adjusted nutrition data:', adjustedData);

    displayResults(adjustedData);
  }
});

function adjustNutritionByWeight(nutritionData, weight) {
  console.log(`Adjusting nutrition by weight: ${weight}`);
  const factor = weight / 100; // Calcola la proporzione
  return {
    calories: nutritionData.calories * factor,
    fats: nutritionData.fats * factor,
    carbs: nutritionData.carbs * factor,
    proteins: nutritionData.proteins * factor,
  };
}

function displayResults(data) {
  const resultBody = document.getElementById('resultBody');
  const weightInput = document.getElementById('weightInput').value || 100;

  console.log('Displaying results:', data);

  resultBody.innerHTML = `
    <tr><td>per ${weightInput} g - Calorie</td><td>${data.calories.toFixed(2)} kcal</td></tr>
    <tr><td>Gras</td><td>${data.fats.toFixed(2)} g</td></tr>
    <tr><td>Carb</td><td>${data.carbs.toFixed(2)} g</td></tr>
    <tr><td>Prot</td><td>${data.proteins.toFixed(2)} g</td></tr>
  `;
}
