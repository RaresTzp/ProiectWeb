import { sequelize } from "../sequelize.js";
import { DataTypes } from 'sequelize'; 


const Session = sequelize.define(
    'Session',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        start_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        }       
    },
    {
        tableName: 'Session',
        timestamps: false
    }

)

export { Session }
