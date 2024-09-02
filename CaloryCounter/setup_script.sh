#!/bin/bash

# Creazione dell'ambiente virtuale Python con Python 3.12
python3.12 -m venv myenv

# Esegui direttamente il comando per attivare l'ambiente virtuale 
# in modo che persista nella shell corrente
source myenv/bin/activate

# Verifica che l'ambiente virtuale sia stato attivato
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "Ambiente virtuale attivato correttamente."

    # Esecuzione di npm install per installare le dipendenze Node.js
    npm install
    npm install axios


    echo "Setup completato con successo!"
else
    echo "Errore: Ambiente virtuale non attivato correttamente."
fi
