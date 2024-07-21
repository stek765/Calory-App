const { ipcRenderer } = require('electron');

document.getElementById('foodForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const foodName = document.getElementById('foodInput').value;

  ipcRenderer.send('search-food', foodName);
});

ipcRenderer.on('food-result', (event, caloriesText) => {
  const resultBody = document.getElementById('resultBody');

  // Pulisci la tabella prima di aggiungere nuovi risultati
  resultBody.innerHTML = '';

  // Rimuovi il testo "Di più..." e "Valori Nutrizionali - Simili"
  const cleanedText = caloriesText.replace(/, Di più...[\s\S]*$/, '').trim();

  // Estrai le informazioni dal testo delle calorie
  const nutritionInfo = cleanedText.split('|').map(info => info.trim());

  // Crea le righe della tabella
  nutritionInfo.forEach(info => {
    const [label, value] = info.split(':');
    const row = document.createElement('tr');
    const cellLabel = document.createElement('td');
    const cellValue = document.createElement('td');
    cellLabel.textContent = label.trim();
    cellValue.textContent = value ? value.trim() : '';
    row.appendChild(cellLabel);
    row.appendChild(cellValue);
    resultBody.appendChild(row);
  });
});
