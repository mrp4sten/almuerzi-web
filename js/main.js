window.onload = () => {
    fetch('https://serverless-aq7pou9ax-mrp4sten.vercel.app/api/meals')
        .then(res => res.json())
        .then(data => {
            const mealsList = document.getElementById('meals-list');
            const btnSubmit = document.getElementById('btnSubmit');
            const template = data.map(x => '<li>' + x.name + '</li>').join('');
            mealsList.innerHTML = template;
            btnSubmit.removeAttribute('disabled'); 
        });
}