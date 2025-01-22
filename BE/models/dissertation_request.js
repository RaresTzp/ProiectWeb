import { sequelize } from "../sequelize.js";
import { DataTypes } from 'sequelize';

const Dissertation_request = sequelize.define(

    'Dissertation_request',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        teacher_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            values: ["in asteptare", "acceptata", "respinsa", "fisier incarcat", "finalizata"],
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },   
        reject_message: {
            type: DataTypes.STRING(150),
            allowNull: true
        }    
    },
    {
        tableName: 'Dissertation_requests',
        timestamps: false
    }

)

export { Dissertation_request };