import { DataTypes, Sequelize } from 'sequelize'

const sequelize = new Sequelize('ecommerce', 'learning', 'l3arn', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
})

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err))

sequelize
  .sync({ force: false }) // Set force to true if you want to recreate the tables
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error synchronizing database:', err))

export const Customers = sequelize.define(
  'Customers',
  {
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }],
  }
)

export const Roles = sequelize.define(
  'Roles',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
)

export const Memberships = sequelize.define(
  'Memberships',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: false }
)

export const UserTokens = sequelize.define('UserTokens', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stillValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
})

export const Employees = sequelize.define(
  'Employees',
  {
    badgeNumber: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }],
  }
)

Customers.hasOne(UserTokens, {
  foreignKey: 'customerId',
  as: 'token',
  onDelete: 'CASCADE',
})

UserTokens.belongsTo(Customers, {
  foreignKey: 'customerId',
  as: 'customer',
  onDelete: 'CASCADE',
})

Customers.belongsTo(Memberships, {
  foreignKey: 'memberShipId',
  as: 'membership',
  onDelete: 'SET NULL',
  defaultValue: 'Standard',
})

Employees.belongsTo(Roles, {
  foreignKey: 'roleId',
  as: 'role',
  onDelete: 'CASCADE',
})

Employees.hasMany(Roles)

//Views
sequelize
  .query(
    `
  CREATE OR REPLACE VIEW UserView AS
  SELECT
    'Customer' AS userType,
    Customers.id,
    Customers.username,
    Customers.email, 
    UserTokens.token as token
  FROM Customers
  LEFT OUTER JOIN UserTokens ON Customers.id = UserTokens.customerId
  UNION ALL
  SELECT
    'Employee' AS userType,
    Employees.badgeNumber,
    Employees.username,
    Employees.email
  FROM Employees;
`
  )
  .then(() => console.log('View created'))
  .catch((err) => console.error('Error creating view:', err))
