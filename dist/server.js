

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/modules/auth/auth.router.ts
import { Router } from "express";

// src/DB/server.ts
import { Pool } from "pg";

// src/Config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STRING,
  secret_key: process.env.SECRETKEY
};
var Config_default = config;

// src/DB/server.ts
var pool = new Pool({
  connectionString: Config_default.connection_string
});
var initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email  VARCHAR(60) UNIQUE NOT NULL,
    password TEXT UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'contributor',

    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()

    )
        `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    CONSTRAINT check_type CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(20) DEFAULT 'open',
    reporter_id INT NOT NULL,

    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()

    )    
        `);
  console.log("Database Connected Successfully");
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var userCreateFromDB = async (payload) => {
  const { name, email, password, role: role2 } = payload;
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(`
    INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, COALESCE($4, 'contributor'))
    RETURNING *
        `, [name, email, passwordHash, role2]);
  delete result.rows[0].password;
  return result;
};
var userLoginFromDB = async (payload) => {
  const { email, password } = payload;
  const user = await pool.query(`
    SELECT * FROM users WHERE email = $1
        `, [email]);
  const userData = user.rows[0];
  if (user.rowCount === 0) {
    throw new Error("Email Not Found");
  }
  const compare = await bcrypt.compare(password, userData.password);
  if (!compare) {
    throw new Error("Invalid Password");
  }
  const jwtPayload = {
    id: userData.id,
    name: userData.name,
    role: userData.role
  };
  const accessToken = jwt.sign(jwtPayload, Config_default.secret_key, { expiresIn: "2d" });
  delete userData.password;
  return { accessToken, userData };
};
var authService = {
  userCreateFromDB,
  userLoginFromDB
};

// src/utility/sendresponse.ts
import "express";
var sendResponse = (res, payload) => {
  const { statusCode, success, message, data, error, user, token } = payload;
  res.status(statusCode).json({
    success,
    message,
    token,
    user,
    data,
    error
  });
};
var sendresponse_default = sendResponse;

// src/modules/auth/auth.controller.ts
var userSignUp = async (req, res) => {
  try {
    const result = await authService.userCreateFromDB(req.body);
    sendresponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var userLogin = async (req, res) => {
  try {
    const { accessToken, userData } = await authService.userLoginFromDB(req.body);
    sendresponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      token: accessToken,
      user: userData
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      errors: error
    });
  }
};
var authController = {
  userSignUp,
  userLogin
};

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/signup", authController.userSignUp);
router.post("/login", authController.userLogin);
var auth = router;

// src/modules/issues/issues.router.ts
import { Router as Router2 } from "express";

// src/modules/issues/issues.service.ts
import jwt2 from "jsonwebtoken";
var createIssuesFromDB = async (payload, token) => {
  const { title, description, type } = payload;
  if (description.length <= 20) {
    throw new Error("Description Minimum 20 Characters");
  } else if (title.length >= 151) {
    throw new Error("Title Maximum 150 Characters");
  }
  const decode = jwt2.verify(token, Config_default.secret_key);
  const reporter_id = decode.id;
  const issues2 = await pool.query(`
    INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4)
    RETURNING *
        `, [title, description, type, reporter_id]);
  return issues2;
};
var getAllFromDB = async (payload) => {
  const { sort, type, status } = payload;
  if (!sort && !type && !status) {
    const issues2 = await pool.query(`
    SELECT * FROM issues
        `);
    return issues2;
  } else if (sort) {
    if (sort === "newest") {
      const issues2 = await pool.query(`
    SELECT * FROM issues ORDER BY create_at ASC
        `);
      if (issues2.rowCount === 0) {
        throw new Error(`${sort} Data Not Found`);
      }
      return issues2;
    } else if (sort === "oldest") {
      const issues2 = await pool.query(`
    SELECT * FROM issues ORDER BY create_at DESC
        `);
      if (issues2.rowCount === 0) {
        throw new Error(`${sort} Data Not Found`);
      }
      return issues2;
    }
  } else if (type) {
    if (type === "bug") {
      const issues2 = await pool.query(`
    SELECT * FROM issues WHERE type = $1
        `, [type]);
      if (issues2.rowCount === 0) {
        throw new Error(`${type} Data Not Found`);
      }
      return issues2;
    } else if (type === "feature_request") {
      const issues2 = await pool.query(`
    SELECT * FROM issues WHERE type = $1
        `, [type]);
      if (issues2.rowCount === 0) {
        throw new Error(`${type} Data Not Found`);
      }
      return issues2;
    }
  } else if (status) {
    if (status === "open") {
      const issues2 = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status]);
      if (issues2.rowCount === 0) {
        throw new Error(`${status} Data Not Found`);
      }
      return issues2;
    } else if (status === "in_progress") {
      const issues2 = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status]);
      if (issues2.rowCount === 0) {
        throw new Error(`${status} Data Not Found`);
      }
      return issues2;
    } else if (status === "resolved") {
      const issues2 = await pool.query(`
    SELECT * FROM issues WHERE status = $1
        `, [status]);
      if (issues2.rowCount === 0) {
        throw new Error(`${status} Data Not Found`);
      }
      return issues2;
    }
  }
};
var getSingleIssuesFromDB = async (id) => {
  const issues2 = await pool.query(`
    SELECT * FROM issues WHERE id=$1    
        `, [id]);
  if (issues2.rowCount === 0) {
    throw new Error("Issues Not Found");
  }
  const reporter_info = issues2.rows[0];
  const reporter_details = await pool.query(`
        SELECT * FROM users WHERE id = $1
        `, [reporter_info.reporter_id]);
  if (reporter_details.rowCount === 0) {
    throw new Error("Reporter Not Found");
  }
  const reporterRes = reporter_details.rows[0];
  const report = {
    id: reporterRes.id,
    name: reporterRes.name,
    role: reporterRes.role
  };
  if (issues2.rowCount === 0) {
    throw new Error("Issues Not Found");
  }
  issues2.rows[0].reporter_id = report;
  return issues2;
};
var updateIssueFromDB = async (payload, id) => {
  const { title, description, type } = payload;
  const issues2 = await pool.query(`
    UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type) WHERE id=$4
    RETURNING *
        `, [title, description, type, id]);
  return issues2;
};
var issuesDeleteFromDB = async (id) => {
  const issues2 = await pool.query(`
    DELETE FROM issues WHERE id = $1
        `, [id]);
  if (issues2.rowCount === 0) {
    throw new Error("Issue Already Delete");
  }
  return issues2;
};
var issuesService = {
  createIssuesFromDB,
  getAllFromDB,
  getSingleIssuesFromDB,
  updateIssueFromDB,
  issuesDeleteFromDB
};

// src/modules/issues/issues.controller.ts
var createIssues = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const result = await issuesService.createIssuesFromDB(req.body, token);
    sendresponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const result = await issuesService.getAllFromDB(req.query);
    sendresponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: result?.rows
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleIssues = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssuesFromDB(id);
    sendresponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issues retrived successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.updateIssueFromDB(req.body, id);
    sendresponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var issuesDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.issuesDeleteFromDB(id);
    sendresponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    sendresponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssues,
  updateIssue,
  issuesDelete
};

// src/role/index.ts
var role = {
  contributor: "contributor",
  maintainer: "maintainer"
};

// src/middleware/authentication.ts
import jwt3 from "jsonwebtoken";
var createIssues2 = (...role2) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendresponse_default(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized"
        });
      }
      const decode = jwt3.verify(token, Config_default.secret_key);
      const userData = await pool.query(`
            SELECT * FROM users WHERE role = $1    
            `, [decode.role]);
      if (userData.rowCount === 0) {
        return sendresponse_default(res, {
          statusCode: 404,
          success: false,
          message: "Not Found"
        });
      }
      const user = userData.rows[0];
      if (role2.length && role2.includes(user.role)) {
        next();
      } else {
        sendresponse_default(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden"
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
var authUpdate = (...role2) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendresponse_default(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized"
        });
      }
      const decode = jwt3.verify(token, Config_default.secret_key);
      const issueId = req.params.id;
      const userData = await pool.query(`
               SELECT * FROM issues WHERE id = $1    
            `, [issueId]);
      const user = userData.rows[0];
      if (userData.rowCount === 0) {
        return sendresponse_default(res, {
          statusCode: 404,
          success: false,
          message: "Not Found"
        });
      }
      if (decode.role === "maintainer") {
        req.user = decode;
        return next();
      }
      if (decode.role === "contributor") {
        if (user.reporter_id === decode.id && user.status === "open") {
          req.user = decode;
          next();
        } else {
          sendresponse_default(res, {
            statusCode: 400,
            success: false,
            message: "Not Own issue or Status Not open"
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };
};
var authDeleteIssues = (...role2) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        sendresponse_default(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized"
        });
      }
      const decode = jwt3.verify(token, Config_default.secret_key);
      if (role2.includes(decode.role)) {
        req.user = decode;
        return next();
      }
      sendresponse_default(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden"
      });
    } catch (error) {
      next(error);
    }
  };
};
var authentication = { createIssues: createIssues2, authUpdate, authDeleteIssues };

// src/modules/issues/issues.router.ts
var router2 = Router2();
router2.post("/", authentication.createIssues(role.contributor, role.maintainer), issuesController.createIssues);
router2.get("/", issuesController.getAllIssues);
router2.get("/:id", issuesController.getSingleIssues);
router2.patch("/:id", authentication.authUpdate(role.contributor, role.maintainer), issuesController.updateIssue);
router2.delete("/:id", authentication.authDeleteIssues(role.maintainer), issuesController.issuesDelete);
var issues = router2;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  sendresponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Welcome To DevPulse API"
  });
});
app.use("/api/auth", auth);
app.use("/api/issues", issues);
var app_default = app;

// src/server.ts
app_default.listen(Config_default.port, () => {
  initDb();
  console.log(`Example app listening on port ${Config_default.port}`);
});
//# sourceMappingURL=server.js.map