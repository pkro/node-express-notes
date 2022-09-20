import {LocalStorage} from 'node-localstorage';

const dbA = new LocalStorage('data-a-n', 4096)
const dbB = new LocalStorage('data-m-z', 4096)

const whichDB = name => name.match(/^[a-n]/i) ? dbA : dbB;

const loadCats = (db) => JSON.parse(db.getItem("cats") || '[]')

const hasCat = name => loadCats(whichDB(name))
    .map(cat => cat.name)
    .includes(name)

const dbobj = {
    addCat(newCat) {
        if (!hasCat(newCat.name)) {
            const db = whichDB(newCat.name);
            let cats = loadCats(db)
            cats.push(newCat)
            db.setItem("cats", JSON.stringify(cats, null, 2))
        }
    },

    findCatByName(name) {
        let cats = loadCats(whichDB(name))
        return cats.find(cat => cat.name === name)
    },

    findCatsByColor(color) {
        return [...loadCats(dbA), ...loadCats(dbB)].filter(cat => cat.color === color)
    }

}
export default dbobj;
