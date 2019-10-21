/* eslint-disable prettier/prettier */
import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {

    initDB() {
        let db;
        return new Promise((resolve) => {
            console.log('Plugin integrity check ...');
            SQLite.echoTest()
                .then(() => {
                    console.log('Integrity check passed ...');
                    console.log('Opening database ...');
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            console.log('Database OPEN');
                            db.transaction((tx) => {
                                tx.executeSql('CREATE TABLE IF NOT EXISTS courses(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(10), address VARCHAR(255), city VARCHAR(255), country VARCHAR(255), id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS tees(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), color VARCHAR(10), rating FLOAT, slope INTEGER, course_id INTEGER, hole_1 INTEGER, hole_2 INTEGER, hole_3 INTEGER, hole_4 INTEGER, hole_5 INTEGER, hole_6 INTEGER, hole_7 INTEGER, hole_8 INTEGER, hole_9 INTEGER, hole_10 INTEGER, hole_11 INTEGER, hole_12 INTEGER, hole_13 INTEGER, hole_14 INTEGER, hole_15 INTEGER, hole_16 INTEGER, hole_17 INTEGER, hole_18 INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS holes(id INTEGER PRIMARY KEY AUTOINCREMENT, par INTEGER, hole_number INTEGER, adv INTEGER, handicap INTEGER, handicap_damas INTEGER, course_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), cellphone VARCHAR(15), ghin_number VARCHAR(10), nick_name VARCHAR(10), handicap INTEGER, strokes INTEGER, photo VARCHAR(200), general_settings_id INTEGER, advantage_settings_id INTEGER, single_nassau_wagers_id INTEGER, extra_bets_id INTEGER, team_nassau_wagers INTEGER, best_ball_teams INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), nick_name VARCHAR(10), cellphone VARCHAR(15), language VARCHAR(10), ghin_number VARCHAR(10), photo VARCHAR(200), general_settings_id INTEGER, single_nassau_wagers_id INTEGER, team_nassau_wagers_id INTEGER, extra_bets_id INTEGER, stableford_settings_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS general_settings(id INTEGER PRIMARY KEY AUTOINCREMENT, rabbit_1_6 INTEGER, rabbit_7_12 INTEGER, rabbit_13_18 INTEGER, medal_play_f9 INTEGER, medal_play_b9 INTEGER, medal_play_18 INTEGER, skins INTEGER, skins_carry_over TINYINT, lowed_adv_on_f9 TINYINT , id_sync INTEGER, ultimate_sync TIMESTAMP)');
                            }).then(() => {
                                resolve(db);
                                //console.log("Table created successfully");
                            }).catch(error => {
                                console.log(error);
                            });

                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log('echoTest failed - plugin not functional');
                });
        });
    }

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log("Database was not OPENED");
        }
    };

    listCourse() {
        return new Promise((resolve) => {
            const courses = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT c.id, c.name, c.short_name, c.address , c.city, c.country, c.id_sync, c.ultimate_sync FROM courses c', []).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Course ID: ${row.id}, Course Name: ${row.name}`);
                            const { id, name, short_name, address, city, country, id_sync, ultimate_sync } = row;
                            courses.push({
                                id,
                                name, 
                                short_name, 
                                address, 
                                city, 
                                country, 
                                id_sync, 
                                ultimate_sync
                            });
                        }
                        console.log(courses);
                        resolve(courses);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    listTee() {
        return new Promise((resolve) => {
            const tees = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT t.id, t.name, t.color, t.rating, t.slope, t.course_id, t.id_sync, t.ultimate_sync FROM tees t', []).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Tee ID: ${row.id}, Tee Name: ${row.name}`);
                            const { id, name, color, rating, slope, course_id, id_sync, ultimate_sync } = row;
                            tees.push({
                                id,
                                name,
                                color,
                                rating,
                                slope,
                                course_id,
                                id_sync,
                                ultimate_sync
                            });
                        }
                        console.log(tees);
                        resolve(tees);
                    });
                }).then((result) => {
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    listTeeByCourseId(courseId) {
        return new Promise((resolve) => {
            const tees = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM tees WHERE course_id= ?', [courseId]).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Tee ID: ${row.id}, Tee Name: ${row.name}`);
                            const { id, name, color, rating, slope, course_id, hole_1, hole_2, hole_3, hole_4, hole_5, hole_6, hole_7, hole_8, hole_9, hole_10, hole_11, hole_12, hole_13, hole_14, hole_15, hole_16, hole_17, hole_18, id_sync, ultimate_sync } = row;
                            tees.push({
                                id,
                                name,
                                color,
                                rating,
                                slope,
                                course_id,
                                hole_1, 
                                hole_2, 
                                hole_3, 
                                hole_4, 
                                hole_5, 
                                hole_6, 
                                hole_7, 
                                hole_8, 
                                hole_9, 
                                hole_10, 
                                hole_11, 
                                hole_12, 
                                hole_13, 
                                hole_14, 
                                hole_15, 
                                hole_16, 
                                hole_17, 
                                hole_18,
                                id_sync,
                                ultimate_sync
                            });
                        }
                        console.log(tees);
                        resolve(tees);
                    });
                }).then((result) => {
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    listHole() {
        return new Promise((resolve) => {
            const holes = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT h.id, h.par, h.hole_number, h.adv, h.handicap, h.handicap_damas, h.course_id, h.id_sync, h.ultimate_sync FROM holes h', []).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Hole ID: ${row.id}, Hole Name: ${row.par}`);
                            const { id, par, hole_number, adv, handicap, handicap_damas, course_id, id_sync, ultimate_sync } = row;
                            holes.push({
                                id,
                                par,
                                hole_number,
                                adv,
                                handicap,
                                handicap_damas,
                                course_id,
                                id_sync, 
                                ultimate_sync,
                            });
                        }
                        console.log(holes);
                        resolve(holes);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    holesByCourseId(course_id) {
        console.log(course_id);
        let holes=[];
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM holes WHERE  course_id= ?', [course_id]).then(([tx, results]) => {
                        console.log(results);
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Hole ID: ${row.id}`);
                            const { id, par, hole_number, adv, handicap, handicap_damas, course_id, id_sync, ultimate_sync } = row;
                            holes.push({
                                id,
                                par,
                                hole_number,
                                adv,
                                handicap,
                                handicap_damas,
                                course_id,
                                id_sync,
                                ultimate_sync,
                            });
                        }
                        resolve(holes);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    listPlayers(){
        let players = [];
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM players', []).then(([tx, results]) => {
                        console.log(results);
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Hole ID: ${row.id}`);
                            const { id, name, last_name, email, cellphone, ghin_number, nick_name, handicap, strokes, photo, general_settings_id, advantage_settings_id, single_nassau_wagers_id, extra_bets_id, team_nassau_wagers, best_ball_teams, id_sync, ultimate_sync } = row;
                            players.push({
                                id, 
                                name, 
                                last_name, 
                                email, 
                                cellphone, 
                                ghin_number,
                                nick_name, 
                                handicap, 
                                strokes,
                                photo, 
                                general_settings_id, 
                                advantage_settings_id, 
                                single_nassau_wagers_id, 
                                extra_bets_id, 
                                team_nassau_wagers, 
                                best_ball_teams,
                                id_sync,
                                ultimate_sync,
                            });
                        }
                        resolve(players);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    courseById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM courses WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        if (results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    holeById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM holes WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        if (results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    teeById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM tees WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        if (results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    generalSettingsById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM general_settings WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        if (results.rows.length > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        }
                    });
                }).then((result) => {
                    //this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addCourse(course) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO courses(name , short_name, address, city, country, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?)', [course.name , course.short_name, course.address, course.city, course.country, course.id_sync, course.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addCourse18Holes(course) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO courses( par, hole_number , adv , handicap, handicap_damas, course_id, id_sync, ul, short_name, address, city, country, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?)', [course.name, course.short_name, course.address, course.city, course.country, course.id_sync, course.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addHole(hole) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO holes(par, hole_number, adv, handicap, handicap_damas, course_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [hole.par, hole.hole_number, hole.adv, hole.handicap, hole.handicap_damas, hole.course_id, hole.id_sync, hole.ultimate_sync ]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    add18Holes(holes) {
        values=[];
        holes.forEach(h => {
            values.push(h.par);
            values.push(h.hole_number);
            values.push(h.adv);
            values.push(h.handicap);
            values.push(h.handicap_damas);
            values.push(h.course_id);
            values.push(h.id_sync);
            values.push(h.ultimate_sync);
        });
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO holes(par, hole_number, adv, handicap, handicap_damas, course_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)', values).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    update18Holes(holes) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    holes.forEach(h => {
                        tx.executeSql('UPDATE holes SET par= ?, adv= ?, handicap= ?, handicap_damas= ?, ultimate_sync= ? WHERE id = ?', [h.par, h.adv, h.handicap, h.handicap_damas, h.ultimate_sync, h.id]).then(([tx, results]) => { });
                    });
                }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addTee(tee) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO tees(name, color, rating, slope, course_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?)', [tee.name, tee.color, tee.rating, tee.slope,tee.course_id, tee.id_sync, tee.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addYardsInTee(tee) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE tees SET hole_1= ?, hole_2= ?, hole_3= ?, hole_4= ?, hole_5= ?, hole_6= ?, hole_7= ?, hole_8= ?, hole_9= ?, hole_10= ?, hole_11= ?, hole_12= ?, hole_13= ?, hole_14= ?, hole_15= ?, hole_16= ?, hole_17= ?, hole_18= ?, ultimate_sync= ? WHERE id = ?', [tee.name, tee.color, tee.rating, tee.slope, tee.course_id, tee.id_sync, tee.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addPlayers(player){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO players(name, last_name, email, cellphone, ghin_number, nick_name, handicap, strokes, photo, general_settings_id, advantage_settings_id, single_nassau_wagers_id, extra_bets_id, team_nassau_wagers, best_ball_teams, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [player.name, player.last_name, player.email, player.cellphone, player.ghin_number, player.nick_name, player.handicap, player.strokes, player.photo, player.general_settings_id, player.advantage_settings_id, player.single_nassau_wagers_id, player.extra_bets_id, player.team_nassau_wagers, player.best_ball_teams, player.id_sync, player.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addGeneralSettings(setting){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO general_settings(rabbit_1_6, rabbit_7_12, rabbit_13_18, medal_play_f9, medal_play_b9, medal_play_18, skins, skins_carry_over, lowed_adv_on_f9, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [setting.rabbit_1_6, setting.rabbit_7_12, setting.rabbit_13_18, setting.medal_play_f9, setting.medal_play_b9, setting.medal_play_18, setting.skins, setting.skins_carry_over, setting.lowed_adv_on_f9, setting.id_sync, setting.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    updateCourse(id, course) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE courses SET name = ?, short_name = ?, address = ?, city = ?, country= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [course.name, course.short_name, course.address, course.city, course.country, course.id_sync, course.ultimate_sync, id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    updateHole(id, hole) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE holes SET par= ?, hole_number= ?, adv= ?, handicap= ?, handicap_damas= ?, course_id= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [hole.par, hole.hole_number, hole.adv, hole.handicap, hole.handicap_damas, hole.course_id, hole.id_sync, hole.ultimate_sync, id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

simpleUpdateHole(id, hole) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE holes SET par= ?, adv= ?, handicap= ?, handicap_damas= ?, ultimate_sync= ? WHERE id = ?', [hole.par, hole.adv, hole.handicap, hole.handicap_damas, hole.ultimate_sync, id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    updateTee(id, tee) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE tees SET name= ?, color= ?, rating= ?, slope= ?, course_id= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [tee.name, tee.color, tee.rating, tee.slope, tee.course_id, tee.id_sync, tee.ultimate_sync, id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    updateYardsInTee(tee) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE tees SET hole_1= ?, hole_2= ?, hole_3= ?, hole_4= ?, hole_5= ?, hole_6= ?, hole_7= ?, hole_8= ?, hole_9= ?, hole_10= ?, hole_11= ?, hole_12= ?,hole_13 = ?, hole_14= ?, hole_15= ?, hole_16= ?, hole_17= ?, hole_18= ?, ultimate_sync= ? WHERE id = ?', [tee.hole_1, tee.hole_2, tee.hole_3, tee.hole_4, tee.hole_5, tee.hole_6, tee.hole_7, tee.hole_8, tee.hole_9, tee.hole_10, tee.hole_11, tee.hole_12, tee.hole_13, tee.hole_14, tee.hole_15, tee.hole_16, tee.hole_17, tee.hole_18, tee.ultimate_sync, tee.id]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    deleteCourse(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM courses WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    deleteHole(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM holes WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    deleteTee(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM tees WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

}
