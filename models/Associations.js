import { Contact } from './Contact.js';
import { User } from './User.js';

Contact.belongsTo(User, { foreignKey: 'owner' });
User.hasMany(Contact, { foreignKey: 'owner' });

// Contact.sync({ alter: true });
// User.sync({ alter: true });
