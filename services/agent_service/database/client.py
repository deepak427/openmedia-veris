"""PostgreSQL database client for Neon"""
import os
import logging
from typing import Optional, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import pool

logger = logging.getLogger(__name__)


class NeonDatabaseClient:
    """PostgreSQL database client for Neon"""
    
    def __init__(self):
        self.connection_pool: Optional[pool.SimpleConnectionPool] = None
        self.project_id = ""
        self.database_name = ""
        self.connected = False
    
    def connect(self, project_id: str, database_name: str = "neondb") -> None:
        """Connect to Neon database"""
        self.project_id = project_id
        self.database_name = database_name
        
        connection_string = os.getenv("DATABASE_URL")
        
        if not connection_string:
            raise ValueError("DATABASE_URL environment variable is required")
        
        try:
            self.connection_pool = pool.SimpleConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=connection_string
            )
            self.connected = True
            logger.info(f"✅ Connected to Neon database: {database_name}")
        except Exception as e:
            logger.error(f"❌ Failed to connect to database: {e}")
            raise
    
    def query(self, sql: str, params: Optional[tuple] = None) -> Dict[str, Any]:
        """Execute SQL query"""
        if not self.connected or not self.connection_pool:
            raise RuntimeError("Database client not connected")
        
        conn = None
        try:
            conn = self.connection_pool.getconn()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute(sql, params)
            
            if cursor.description:
                rows = cursor.fetchall()
                result = {
                    "rows": [dict(row) for row in rows],
                    "rowcount": cursor.rowcount
                }
            else:
                result = {"rowcount": cursor.rowcount}
            
            conn.commit()
            return result
            
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Query error: {e}")
            return {"error": str(e)}
        finally:
            if conn:
                self.connection_pool.putconn(conn)
    
    def disconnect(self) -> None:
        """Close database connection pool"""
        if self.connection_pool:
            self.connection_pool.closeall()
            self.connection_pool = None
        self.connected = False
        logger.info("Database connection closed")


db_client = NeonDatabaseClient()
