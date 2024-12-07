import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);


export const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {},
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'customer'
    },
});

export const Employee = sequelize.define('Employee', { 
    username: {},
    password: {},
    email: {},
    role: {
        type: DataTypes.STRING,
        defaultValue: 'employee'
    },
})