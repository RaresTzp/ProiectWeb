import { sequelize } from "../sequelize.js";
import { DataTypes } from 'sequelize'; 


const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique:true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: [/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}/]
            }
        },
        account_type: {
            type: DataTypes.STRING,
            allowNull: false,
            values: ["student", "profesor"],
        },
        student_number: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            validate: {
                onlyForTeacher: function(value) {
                    if (this.account_type === 'profesor' && value === null) {
                        throw new Error("Numărul de studenti trebuie completat pentru tipul de cont 'profesor'.");
                    }
                }
            }
        }        
    },
    {
        tableName: 'Users',
        timestamps: false
    }

)

export { User }
