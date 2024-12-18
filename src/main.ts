import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const templateTop = document.getElementById('animalTableTop') as HTMLTemplateElement;
const templateBottom = document.getElementById('animalTableRow') as HTMLTemplateElement;
const animalAnimals = document.getElementById('animalAnimals') as HTMLElement;
const animalSpecies = document.getElementById('animalSpecies') as HTMLElement;
let animalSpeciesTypes = new Set<AnimalSpecies>();


interface Animal {
  id: number;
  name: string;
  species: string;
  age: number;
}

interface AnimalSpecies {
  species: string;
  _count: number;
}

function getItem(config: Animal): {id: number, name: string, species: string, age: number} {
  return {
    id: config.id,
    name: config.name,
    species: config.species,
    age: config.age
  };
}

function getSpeciesItem(config: AnimalSpecies): {species: string, _count: number} {
  return {
    species: config.species,
    _count: config._count
  };
}

function renderTable(tableTop: HTMLTemplateElement, tableBottom: HTMLTemplateElement, animals:Animal[]) {
  let cloneTop: any = tableTop.content.cloneNode(true);
  let tbody = cloneTop.querySelectorAll('tbody');
  for (const e of animals) {
    let cloneContent: any = tableBottom.content.cloneNode(true);
    cloneContent.querySelectorAll('td')[0].textContent = e.name;
    cloneContent.querySelectorAll('td')[1].textContent = e.species;
    cloneContent.querySelectorAll('td')[2].textContent = e.age;
    cloneContent.querySelectorAll('td')[3].querySelector('button')!.addEventListener('click', async() => {
      const res = await fetch('http://localhost:3000/animals/' + e.id, {
        method: 'DELETE',
      });
      console.log(res.status);
      document.getElementById("app")!.innerHTML = "";
      Init();
    });
    tbody[0].appendChild(cloneContent);
  }
  document.getElementById("app")!.appendChild(cloneTop);
}

async function Init(): Promise<void> {
  document.getElementById("appTitle")!.textContent = "Animals by Order";
  let animals_Array: Animal[] = [];
  const res = await fetch('http://localhost:3000/animals');
  const animals = await res.json();
  for (const animal of animals) {
    const animalObj: Animal = getItem(animal);
    animals_Array.push(animalObj);
  }

  renderTable(templateTop, templateBottom, animals);
}

animalAnimals.addEventListener('click', async() => {
  document.getElementById("appTitle")!.textContent = "Animals by Order";
  let animals_Array: Animal[] = [];
  const res = await fetch('http://localhost:3000/animals');
  const animals = await res.json();
  for (const animal of animals) {
    const animalObj: Animal = getItem(animal);
    animals_Array.push(animalObj);
  }
  document.getElementById("app")!.innerHTML = "";
  renderTable(templateTop, templateBottom, animals);
});

animalSpecies.addEventListener('click', async() => {
  document.getElementById("appTitle")!.textContent = "Animals by Species";
  let animals_Array: Animal[] = [];
  const res = await fetch('http://localhost:3000/animals');
  const animals = await res.json();
  for (const animal of animals) {
    const animalObj: Animal = getItem(animal);
    animals_Array.push(animalObj);
  }

  animalSpeciesTypes.clear();
  const res2 = await fetch('http://localhost:3000/animals/bySpecies');
  const speciestypes = await res2.json();
  for (const e of speciestypes) {
    const speciesObj: AnimalSpecies = getSpeciesItem(e);
    animalSpeciesTypes.add(speciesObj);
  }
  
  document.getElementById("app")!.innerHTML = "";
  for (const types of animalSpeciesTypes) {
    let spec = document.createElement('h1');
    let spUP = types.species[0].toUpperCase()+types.species.slice(1);
    spec.textContent = `${spUP} - ${types._count}db`;
    document.getElementById("app")!.appendChild(spec);
    renderTable(templateTop, templateBottom, animals_Array.filter((animal) => animal.species === types.species));
  }
});

Init();









