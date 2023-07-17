const express = require("express");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const router = express.Router();
const dir = path.join(__dirname, "users");
const shortId = require("shortid");
const sql = require("./sql");

const SIZE = 2147483648;

const getFiles = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
};

const getFileSize = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(err);
      return resolve(stats.size);
    });
  });
};

const getFolderSize = (pth) => {
  return new Promise(async (resolve, reject) => {
    let total = 0;
    const files = await getFiles(pth);
    for (const file of files) {
      if (fs.lstatSync(path.join(pth, file)).isDirectory()) {
        const size = await getFolderSize(path.join(pth, file));
        total += size;
      } else {
        const size = await getFileSize(path.join(pth, file));
        total += size;
      }
    }
    resolve(total);
  });
};

const makeBase = () => {
  const userFolder = dir;
  const zipFolder = path.join(dir, "usersZip");
  if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder);
  if (!fs.existsSync(zipFolder)) fs.mkdirSync(zipFolder);
};

makeBase();

router.post("/create-folder", (req, res) => {
  const { folder } = req.body;
  sql
    .checkToken(req.headers.authorization)
    .then((auth) => {
      const newFolder = path
        .join(dir, auth.user, folder)
        .replaceAll("%20", " ");
      try {
        fs.mkdirSync(newFolder);
        res.status(200).send({ message: "Created!" });
      } catch (err) {
        res.status(500).send({ message: "Something went wrong!" });
        console.error(err);
        return;
      }
    })
    .catch(() => {
      res.status(401).send();
    });
});

router.get("/folders", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then((result) => {
      const pth = path.join(dir, result.user).replaceAll("%20", " ");
      const isFolder = fs.existsSync(pth);
      if (isFolder) {
        getFiles(pth).then((files) => {
          return res.status(200).send(files);
        });
      } else {
        fs.mkdirSync(pth);
        getFiles(pth).then((files) => {
          return res.status(200).send(files);
        });
      }
    })
    .catch(() => {
      res.status(401).send();
    });
});

router.get("/folder-size", (req, res) => {
  sql.checkToken(req.headers.authorization).then(async (auth) => {
    const pth = path.join(dir, auth.user).replaceAll("%20", " ");
    try {
      const size = await getFolderSize(pth);
      res.status(200).send({ size });
    } catch (err) {
      res.status(500).send();
      console.error(err);
    }
  });
});

router.get("/download-file", (req, res) => {
  const { uri } = req.query;
  const basePath = uri.split("/")[1];
  const remaining_path = uri.split("/").slice(2).join("/");
  sql
    .getSharedLink(basePath)
    .then((data) => {
      if (!data) return res.sendFile(path.join(dir, uri));
      res.set(
        "Content-Disposition",
        `attachment; filename="${basePath.at(-1)}"`
      );
      return res.sendFile(path.join(dir, data.folder, remaining_path));
    })
    .catch(() => {
      res.set(
        "Content-Disposition",
        `attachment; filename="${uri.split("/").at(-1)}"`
      );
      return res.sendFile(path.join(dir, uri));
    });
});

router.get("/download-folder", async (req, res) => {
  const { uri } = req.query;
  const uid = shortId.generate();
  const folderName = uri.split("/").at(-1);
  const zipPath = path.join(dir, "usersZip");
  const output = fs.createWriteStream(zipPath + `/${uid}.zip`);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);
  archive.directory(path.join(dir, uri), false);
  await archive.finalize();
  output.on("close", () => {
    res.set("Content-Disposition", `attachment; filename="${folderName}.zip"`);
    res.sendFile(path.join(zipPath, `${uid}.zip`));
    res.on("finish", () => {
      fs.unlink(path.join(zipPath, `${uid}.zip`), (err) => {
        if (err) console.error(err);
      });
    });
  });
  output.on("error", (err) => {
    if (err) res.status(500).send();
  });
});

router.get("/share", (req, res) => {
  const { token, uri } = req.query;
  sql
    .getSharedLink(token)
    .then((data) => {
      const pth = path.join(dir, data.folder, uri).replaceAll("%20", " ");
      const file_folder = pth.split("\\").at(-1);
      if (fs.lstatSync(pth).isDirectory()) {
        getFiles(pth).then((files) => {
          return res.status(200).send(files);
        });
      } else {
        return res.status(200).send([file_folder.split("/").at(-1)]);
      }
    })
    .catch(() => {
      res.status(404).send();
    });
});

router.get("/*:path", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then((auth) => {
      const pth = path.join(dir, auth.user, req.path).replaceAll("%20", " ");
      fs.readdir(pth, (err, files) => {
        if (err) {
          res.status(500).send({ message: "Something went wrong!" });
          console.error(err);
        }
        res.status(200).send(files);
      });
    })
    .catch(() => {
      res.status(401).send();
    });
});

router.post("/upload", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then(async (auth) => {
      const { file } = req.files;
      const { folder } = req.body;
      const usage = await getFolderSize(path.join(dir, auth.user));
      if (usage + file.size > SIZE) {
        return res.status(400).send({
          message: `You don't have enough storage to upload ${file.name}`,
        });
      }
      if (usage < SIZE) {
        file.mv(
          path.join(dir, folder.replaceAll("%20", " "), file.name),
          (err) => {
            if (err) {
              res.status(500).send({ message: "Something went wrong!" });
              console.error(err);
            }
            res.status(200).send({ message: "success" });
          }
        );
      } else {
        res
          .status(400)
          .send({ message: "You've used up all of you're storage." });
      }
    })
    .catch(() => {
      res.status(401).send();
    });
});

router.delete("/delete", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then(() => {
      const { uri } = req.body;
      const file = uri.split("/").at(-1);
      const ends = file.split(".")[1];
      try {
        if (ends) {
          fs.rmSync(path.join(dir, uri).replaceAll("%20", " "));
          res.status(200).send({ message: "Success" });
        } else {
          fs.rmSync(path.join(dir, uri).replaceAll("%20", " "), {
            recursive: true,
            force: true,
          });
          res.status(200).send({
            message: "Success",
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Something went wrong!" });
      }
    })
    .catch(() => {
      res.status(401).send();
    });
});

router.post("/auth", (req, res) => {
  const { email } = req.body;
  const token = shortId.generate();
  sql
    .create_or_update_auth_token(email, token)
    .then((token) => {
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send();
    });
});

router.post("/share-folder", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then((result) => {
      const { uri } = req.body;
      const folder = uri.replace("dashboard", result.user);
      const token = shortId.generate();
      sql
        .createSharedLink(token, folder)
        .then(() => {
          res.status(200).send({ share_token: token });
        })
        .catch(() => {
          res.status(500).send();
        });
    })
    .catch(() => res.status(401).send());
});

router.post("/rename", (req, res) => {
  sql
    .checkToken(req.headers.authorization)
    .then((result) => {
      const { oldName, newName } = req.body;
      const old = path.join(dir, oldName).replace("dashboard", result.user);
      const newN = path.join(dir, newName).replace("dashboard", result.user);
      fs.rename(old, newN, (err) => {
        console.error(err);
        if (err) return res.status(500).send();
        res.status(200).send();
      });
    })
    .catch(() => {
      res.status(401).send();
    });
});

module.exports = router;
