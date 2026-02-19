###############################################################################
# Project-specific settings
###############################################################################

# Shows debug messages while Silence is running
DEBUG_ENABLED = False

# Database connection details
DB_CONN = {
    "host": "127.0.0.1",
    "port": 3306,
    "username": "issi_user_gallery",
    "password": "1234",
    "database": "gallery",
}

# The sequence of SQL scripts located in the sql/ folder that must
# be ran when the 'silence createdb' command is issued
SQL_SCRIPTS = [
    "create_tables.sql",
    "create_views.sql",
    "populate_database.sql",
]

# The port in which the API and the web server will be deployed
HTTP_PORT = 8080

# The URL prefix for all API endpoints
API_PREFIX = "/api/efn"

# Table and fields that are used for both login and register
USER_AUTH_DATA = {
    "table": "Users",
    "identifier": "username",
    "password": "password",
}

# A random string that is used for security purposes
# (this has been generated automatically upon project creation)
SECRET_KEY = "JJEFNEFNEFNJJJJ"
