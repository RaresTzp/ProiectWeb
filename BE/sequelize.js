import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'./sqlite/dissertation.db',
});


sequelize.sync({alter:true}).then(()=>{
    console.log("All models has been synchronized");
}).catch((error) => {
    console.error('Eroare la crearea tabelelor:', error);
});

export { sequelize };