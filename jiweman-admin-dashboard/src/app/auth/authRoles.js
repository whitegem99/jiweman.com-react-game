/**
 * Authorization Roles
 */
const authRoles = {
	onlySuperAdmin: ['super_admin'],
	admin: ['admin', 'super_admin'],
	// staff: ['admin', 'staff'],
	// user: ['admin', 'staff', 'user'],
	onlyGuest: []
};

export default authRoles;
