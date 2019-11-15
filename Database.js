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
                                tx.executeSql('CREATE TABLE IF NOT EXISTS tees(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), color VARCHAR(10), rating FLOAT, slope INTEGER, course_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS holes(id INTEGER PRIMARY KEY AUTOINCREMENT, par INTEGER, hole_number INTEGER, adv INTEGER, yards INTEGER, tee_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), cellphone VARCHAR(15), ghin_number VARCHAR(10), nick_name VARCHAR(10), handicap INTEGER, strokes INTEGER, photo VARCHAR(200), general_settings_id INTEGER, advantage_settings_id INTEGER, single_nassau_wagers_id INTEGER, extra_bets_id INTEGER, team_nassau_wagers_id INTEGER, best_ball_teams_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), nick_name VARCHAR(10), cellphone VARCHAR(15), language VARCHAR(10), handicap, ghin_number VARCHAR(10), photo VARCHAR(200), general_settings_id INTEGER, single_nassau_wagers_id INTEGER, team_nassau_wagers_id INTEGER, extra_bets_id INTEGER, stableford_settings_id INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS general_settings(id INTEGER PRIMARY KEY AUTOINCREMENT, rabbit_1_6 INTEGER, rabbit_7_12 INTEGER, rabbit_13_18 INTEGER, medal_play_f9 INTEGER, medal_play_b9 INTEGER, medal_play_18 INTEGER, skins INTEGER, skins_carry_over TINYINT, lowed_adv_on_f9 TINYINT , id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS single_nassau_wagers(id INTEGER PRIMARY KEY AUTOINCREMENT, automatic_presses_every INTEGER, front_9 INTEGER, back_9 INTEGER, match INTEGER, total_18 INTEGER, carry INTEGER, medal INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS team_nassau_wagers(id INTEGER PRIMARY KEY AUTOINCREMENT, automatic_presses_every INTEGER, front_9 INTEGER, back_9 INTEGER, match INTEGER, total_18 INTEGER, carry INTEGER, medal INTEGER, who_gets_the_adv_strokes VARCHAR(20), id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS rounds(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(150), course_id INTEGER, date DATE, hcp_adjustment FLOAT, online_key VARCHAR(250), starting_hole INTEGER, adv_b9_f9 TINYINT, id_sync INTEGER, ultimate_sync TIMESTAMP)');
                                tx.executeSql('CREATE TABLE IF NOT EXISTS round_members(id INTEGER PRIMARY KEY AUTOINCREMENT, player_id INTEGER, nick_name VARCHAR(10), photo VARCHAR(200), tee_id INTEGER, round_id INTEGER, handicap FLOAT, strokes_h1 INTEGER, adv_h1 INTEGER, strokes_h2 INTEGER, adv_h2 INTEGER, strokes_h3 INTEGER, adv_h3 INTEGER, strokes_h4 INTEGER, adv_h4 INTEGER, strokes_h5 INTEGER, adv_h5 INTEGER, strokes_h6 INTEGER, adv_h6 INTEGER, strokes_h7 INTEGER, adv_h7 INTEGER, strokes_h8 INTEGER, adv_h8 INTEGER, strokes_h9 INTEGER, adv_h9 INTEGER, strokes_h10 INTEGER, adv_h10 INTEGER, strokes_h11 INTEGER, adv_h11 INTEGER, strokes_h12 INTEGER, adv_h12 INTEGER, strokes_h13 INTEGER, adv_h13 INTEGER, strokes_h14 INTEGER, adv_h14 INTEGER, strokes_h15 INTEGER, adv_h15 INTEGER, strokes_h16 INTEGER, adv_h16 INTEGER, strokes_h17 INTEGER, adv_h17 INTEGER, strokes_h18 INTEGER, adv_h18 INTEGER, id_sync INTEGER, ultimate_sync TIMESTAMP)');
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

    listRounds() {
        return new Promise((resolve) => {
            const rounds = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM rounds', []).then(([tx, results]) => {
                        console.log("Query completed");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Course ID: ${row.id}, Course Name: ${row.name}`);
                            const { id, name, date, course_id, hcp_adjustment, online_key, starting_hole, adv_b9_f9, id_sync, ultimate_sync } = row;
                            rounds.push({
                                id,
                                name,
                                date,
                                course_id, 
                                hcp_adjustment, 
                                online_key, 
                                starting_hole, 
                                adv_b9_f9, 
                                id_sync, 
                                ultimate_sync
                            });
                        }
                        console.log(rounds);
                        resolve(rounds);
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

    listRoundJOIN() {
        return new Promise((resolve) => {
            const rounds = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT rounds.id, rounds.name, rounds.course_id, rounds.hcp_adjustment, rounds.online_key, rounds.starting_hole, rounds.adv_b9_f9, rounds.id_sync, rounds.ultimate_sync, round_members.handicap, round_members.id FROM rounds LEFT JOIN round_members ON rounds.id=round_members.round_id', []).then(([tx, results]) => {
                        var len = results.rows.length;
                        console.log('===================== RESULTADOS =================');
                        console.log(results.rows);
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            alert('entra');
                            console.log('====================================== RONDA ============================');
                            console.log(`Ronda ID: ${row.id}, Ronda Name: ${row.name}`);
                            console.log(row);
                            const { id, name, course_id, hcp_adjustment, online_key, starting_hole, adv_b9_f9, id_sync, ultimate_sync } = row;
                            rounds.push({
                                id,
                                name,
                                course_id,
                                hcp_adjustment,
                                online_key,
                                starting_hole,
                                adv_b9_f9,
                                id_sync,
                                ultimate_sync
                            });
                        }
                        console.log(rounds);
                        resolve(rounds);
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

    listMembersByRoundId(round_id) {
        return new Promise((resolve) => {
            const members = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT round_members.id, round_members.player_id, round_members.nick_name, round_members.photo, round_members.tee_id, round_members.adv_h1, round_members.adv_h2, round_members.adv_h3, round_members.adv_h4, round_members.adv_h5, round_members.adv_h6, round_members.adv_h7, round_members.adv_h8, round_members.adv_h9, round_members.adv_h10, round_members.adv_h11, round_members.adv_h12, round_members.adv_h13, round_members.adv_h14, round_members.adv_h15, round_members.adv_h16, round_members.adv_h17, round_members.adv_h18, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo  FROM round_members, tees, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND round_members.round_id=?', [round_id]).then(([tx, results]) => {
                        console.log("============================ Query completed ========================================");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Member ID: ${row.id}`);
                            const { color, handicap, id, name, nick_name, photo, adv_h1, adv_h2, adv_h3, adv_h4, adv_h5, adv_h6, adv_h7, adv_h8, adv_h9, adv_h10, adv_h11, adv_h12, adv_h13, adv_h14, adv_h15, adv_h16, adv_h17, adv_h18, player_id, tee_id, id_sync, ultimate_sync } = row;
                            members.push({
                                id,
                                player: {
                                    id: player_id,
                                    nick_name: nick_name,
                                    photo: photo,
                                }, 
                                tee: {
                                    id: tee_id,
                                    name: name,
                                    color: color
                                },
                                nick_name,
                                photo,
                                adv_h1, 
                                adv_h2, 
                                adv_h3, 
                                adv_h4, 
                                adv_h5, 
                                adv_h6, 
                                adv_h7, 
                                adv_h8, 
                                adv_h9, 
                                adv_h10, 
                                adv_h11, 
                                adv_h12, 
                                adv_h13, 
                                adv_h14, 
                                adv_h15, 
                                adv_h16, 
                                adv_h17, 
                                adv_h18, 
                                round_id,  
                                handicap,
                                id_sync, 
                                ultimate_sync
                            });
                        }
                        //console.log(members);
                        resolve(members);
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

    listMembersByRoundIdHole(hole,round_id) {
        return new Promise((resolve) => {
            const members = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    switch (hole) {
                        case 1:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h1, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h1, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h1: strokes_h1==null ? '' : strokes_h1.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 2:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h2, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h2, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h2: strokes_h2==null ? '' : strokes_h2.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 3:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h3, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h3, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h3: strokes_h3 == null ? '' : strokes_h3.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 4:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h4, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h4, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h4: strokes_h4 == null ? '' : strokes_h4.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 5:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h5, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h5, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h5: strokes_h5 == null ? '' : strokes_h5.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 6:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h6, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h6, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h6: strokes_h6 == null ? '' : strokes_h6.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 7:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h7, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    console.log(row);
                                    const { color, handicap, id, strokes_h7, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h7: strokes_h7 == null ? '' : strokes_h7.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 8:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h8, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h8, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h8: strokes_h8 == null ? '' : strokes_h8.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 9:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h9, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h9, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h9: strokes_h9 == null ? '' : strokes_h9.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            })
                            break;
                        case 10:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h10, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h10, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h10: strokes_h10 == null ? '' : strokes_h10.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 11:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h11, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h11, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h11: strokes_h11 == null ? '' : strokes_h11.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 12:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h12, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h12, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h12: strokes_h12 == null ? '' : strokes_h12.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 13:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h13, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h13, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h13: strokes_h13 == null ? '' : strokes_h13.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 14:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h14, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h14, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h14: strokes_h14 == null ? '' : strokes_h14.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 15:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h15, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h15, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h15: strokes_h15 == null ? '' : strokes_h15.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 16:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h16, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h16, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h16: strokes_h16 == null ? '' : strokes_h16.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 17:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h17, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h17, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h17: strokes_h17 == null ? '' : strokes_h17.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        case 18:
                            tx.executeSql('SELECT round_members.id, round_members.strokes_h18, round_members.adv_h1,round_members.player_id, round_members.tee_id, round_members.handicap, round_members.id_sync, round_members.ultimate_sync, tees.name, tees.color, players.nick_name, players.photo, holes.par, holes.adv, holes.yards  FROM round_members, tees, holes, players WHERE tees.id=round_members.tee_id AND players.id=round_members.player_id AND holes.tee_id=round_members.tee_id AND holes.hole_number=? AND round_members.round_id=? ', [hole, round_id]).then(([tx, results]) => {
                                var len = results.rows.length;
                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    console.log(`Member ID: ${row.id}`);
                                    //console.log(row);
                                    const { color, handicap, id, strokes_h18, name, nick_name, photo, player_id, tee_id, id_sync, ultimate_sync, par, adv, yards } = row;
                                    members.push({
                                        key: (i + 1).toString(),
                                        id,
                                        strokes_h18: strokes_h18 == null ? '' : strokes_h18.toString(),
                                        player: {
                                            id: player_id,
                                            nick_name: nick_name,
                                            photo: photo,
                                        },
                                        tee: {
                                            id: tee_id,
                                            name: name,
                                            color: color
                                        },
                                        hole: {
                                            par: par.toString(),
                                            adv: adv.toString(),
                                            yards: yards.toString()
                                        },
                                        round_id,
                                        handicap,
                                        id_sync,
                                        ultimate_sync
                                    });
                                }
                                resolve(members);
                            });
                            break;
                        default:
                            resolve('Hole number invalid');
                            break;
                    }
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

    updateScoreMemberInHole(hole,member){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    switch (hole) {
                        case 1:
                                tx.executeSql('UPDATE round_members SET strokes_h1= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h1, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 2:
                                tx.executeSql('UPDATE round_members SET strokes_h2= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h2, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 3:
                                tx.executeSql('UPDATE round_members SET strokes_h3= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h3, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 4:
                                tx.executeSql('UPDATE round_members SET strokes_h4= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h4, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 5:
                                tx.executeSql('UPDATE round_members SET strokes_h5= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h5, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 6:
                                tx.executeSql('UPDATE round_members SET strokes_h6= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h6, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 7:
                                tx.executeSql('UPDATE round_members SET strokes_h7= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h7, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                })
                            break;
                        case 8:
                                tx.executeSql('UPDATE round_members SET strokes_h8= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h8, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                })
                            break;
                        case 9:
                                tx.executeSql('UPDATE round_members SET strokes_h9= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h9, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 10:
                                tx.executeSql('UPDATE round_members SET strokes_h10= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h10, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                })
                            break;
                        case 11:
                                tx.executeSql('UPDATE round_members SET strokes_h11= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h11, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 12:
                                tx.executeSql('UPDATE round_members SET strokes_h12= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h12, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 13:
                                tx.executeSql('UPDATE round_members SET strokes_h13= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h13, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 14:
                                tx.executeSql('UPDATE round_members SET strokes_h14= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h14, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 15:
                                tx.executeSql('UPDATE round_members SET strokes_h15= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h15, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 16:
                                tx.executeSql('UPDATE round_members SET strokes_h16= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h16, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 17:
                                tx.executeSql('UPDATE round_members SET strokes_h17= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h17, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        case 18:
                                tx.executeSql('UPDATE round_members SET strokes_h18= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [member.strokes_h18, member.id_sync, member.ultimate_sync, member.id]).then(([tx, results]) => {
                                    resolve(results);
                                });
                            break;
                        default:
                            resolve('Hole number invalid');
                            break;
                        }
                    }).then((result) => {
                        resolve(result);
                        //this.closeDatabase(db);
                    }).catch((err) => {
                        console.log(err);
                        resolve(err);
                    });
            }).catch((err) => {
                console.log(err);
                resolve(err);
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

    holesByTeeId(tee_id) {
        let holes=[];
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM holes WHERE  tee_id= ?', [tee_id]).then(([tx, results]) => {
                        console.log(results);
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Hole ID: ${row.id}`);
                            const { id, par, hole_number, adv, yards, tee_id, id_sync, ultimate_sync } = row;
                            holes.push({
                                id,
                                par,
                                hole_number,
                                adv,
                                yards,
                                tee_id,
                                id_sync,
                                ultimate_sync,
                            });
                        }
                        resolve(holes);
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
                            console.log(`Player ID: ${row.id}`);
                            const { id, name, last_name, email, cellphone, ghin_number, nick_name, handicap, strokes, photo, general_settings_id, advantage_settings_id, single_nassau_wagers_id, extra_bets_id, team_nassau_wagers_id, best_ball_teams_id, id_sync, ultimate_sync } = row;
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
                                team_nassau_wagers_id, 
                                best_ball_teams_id,
                                id_sync,
                                ultimate_sync,
                            });
                        }
                        resolve(players);
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

    userById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM users WHERE id = ?', [id]).then(([tx, results]) => {
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

    singleSettingsById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM single_nassau_wagers WHERE id = ?', [id]).then(([tx, results]) => {
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

    teamSettingsById(id) {
        console.log(id);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM team_nassau_wagers WHERE id = ?', [id]).then(([tx, results]) => {
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

    addRound(round) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO rounds(name, course_id, date, hcp_adjustment, online_key, starting_hole, adv_b9_f9, id_sync, ultimate_sync) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?)', [round.name, round.course_id, round.date, round.hcp_adjustment, round.online_key, round.starting_hole, round.adv_b9_f9, round.id_sync, round.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
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

    addMember(member) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO round_members(player_id, nick_name, photo, tee_id, round_id, adv_h1, adv_h2, adv_h3, adv_h4, adv_h5, adv_h6, adv_h7, adv_h8, adv_h9, adv_h10, adv_h11, adv_h12, adv_h13, adv_h14, adv_h15, adv_h16, adv_h17, adv_h18, handicap, id_sync, ultimate_sync) VALUES (? , ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [member.player_id, member.nick_name, member.photo, member.tee_id, member.round_id, member.adv_h1, member.adv_h2, member.adv_h3, member.adv_h4, member.adv_h5, member.adv_h6, member.adv_h7, member.adv_h8, member.adv_h9, member.adv_h10, member.adv_h11, member.adv_h12, member.adv_h13, member.adv_h14, member.adv_h15, member.adv_h16, member.adv_h17, member.adv_h18, member.handicap, member.id_sync, member.ultimate_sync]).then(([tx, results]) => {
                        resolve(results);
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

    add18Holes(holes) {
        values=[];
        holes.forEach(h => {
            values.push(h.par);
            values.push(h.hole_number);
            values.push(h.adv);
            values.push(h.yards);
            values.push(h.tee_id);
            values.push(h.id_sync);
            values.push(h.ultimate_sync);
        });
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO holes(par, hole_number, adv, yards, tee_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)', values).then(([tx, results]) => {
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
                        tx.executeSql('UPDATE holes SET par= ?, adv= ?, yards= ?, ultimate_sync= ? WHERE id = ?', [h.par, h.adv, h.yards, h.ultimate_sync, h.id]).then(([tx, results]) => { 
                            resolve(results);
                        });
                    });
                }).then((result) => {
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

    addUser(user){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO users(name, last_name, email, nick_name, cellphone, language, handicap, ghin_number, photo, general_settings_id, single_nassau_wagers_id, team_nassau_wagers_id, extra_bets_id, stableford_settings_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user.name, user.last_name, user.email, user.nick_name, user.cellphone, user.language, user.handicap, user.ghin_number, user.photo, user.general_settings_id, user.single_nassau_wagers_id, user.team_nassau_wagers_id, user.extra_bets_id, user.stableford_settings_id, user.id_sync, user.ultimate_sync]).then(([tx, results]) => {
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
                    tx.executeSql('INSERT INTO players(name, last_name, email, cellphone, ghin_number, nick_name, handicap, strokes, photo, general_settings_id, advantage_settings_id, single_nassau_wagers_id, extra_bets_id, team_nassau_wagers_id, best_ball_teams_id, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [player.name, player.last_name, player.email, player.cellphone, player.ghin_number, player.nick_name, player.handicap, player.strokes, player.photo, player.general_settings_id, player.advantage_settings_id, player.single_nassau_wagers_id, player.extra_bets_id, player.team_nassau_wagers_id, player.best_ball_teams, player.id_sync, player.ultimate_sync]).then(([tx, results]) => {
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
                    tx.executeSql('INSERT INTO general_settings(rabbit_1_6, rabbit_7_12, rabbit_13_18, medal_play_f9, medal_play_b9, medal_play_18, skins, skins_carry_over, lowed_adv_on_f9, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [setting.rabbit_1_6, setting.rabbit_7_12, setting.rabbit_13_18, setting.medal_play_f9, setting.medal_play_b9, setting.medal_play_18, setting.skins, setting.skins_carry_over, setting.lowed_adv_on_f9, setting.id_sync, setting.ultimate_sync]).then(([tx, results]) => {
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

    addSingleNassauSettings(setting) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO single_nassau_wagers(automatic_presses_every, front_9, back_9, match, medal, total_18, carry, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [setting.automatic_presses_every, setting.front_9, setting.back_9, setting.match, setting.medal, setting.total_18, setting.carry, setting.id_sync, setting.ultimate_sync]).then(([tx, results]) => {
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

    addTeamNassauSettings(setting) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO team_nassau_wagers(automatic_presses_every, front_9, back_9, match, total_18, carry, medal, who_gets_the_adv_strokes, id_sync, ultimate_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [setting.automatic_presses_every, setting.front_9, setting.back_9, setting.match, setting.total_18, setting.carry, setting.medal, setting.who_gets_the_adv_strokes, setting.id_sync, setting.ultimate_sync]).then(([tx, results]) => {
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

    updateRound(round) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE rounds SET name=?, hcp_adjustment=?, online_key=?, starting_hole=?, adv_b9_f9=?, id_sync=?, ultimate_sync=? WHERE id=?', [round.name, round.hcp_adjustment, round.online_key, round.starting_hole, round.adv_b9_f9, round.id_sync, round.ultimate_sync, round.id]).then(([tx, results]) => {
                        resolve(results);
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

    updateOnlineKeyRound(id, hcp_adjustment) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE rounds SET name=?, hcp_adjustment=?, online_key=?, starting_hole=?, adv_b9_f9=?, id_sync=?, ultimate_sync=? WHERE id=?', [round.name, round.hcp_adjustment, round.online_key, round.starting_hole, round.adv_b9_f9, round.id_sync, round.ultimate_sync, round.id]).then(([tx, results]) => {
                        resolve(results);
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

    updateCourse(course) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE courses SET name = ?, short_name = ?, address = ?, city = ?, country= ?, id_sync= ?, ultimate_sync= ? WHERE id = ?', [course.name, course.short_name, course.address, course.city, course.country, course.id_sync, course.ultimate_sync, course.id]).then(([tx, results]) => {
                        resolve(results);
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

    updatePlayer(player) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE players SET name= ?, last_name= ?, email= ?, cellphone= ?, ghin_number= ?, nick_name= ?, handicap= ?, strokes= ?, photo= ?, general_settings_id= ?, advantage_settings_id= ?, single_nassau_wagers_id= ?, extra_bets_id= ?, team_nassau_wagers_id= ?, best_ball_teams_id= ?, id_sync= ?, ultimate_sync= ? WHERE id= ?', [player.name, player.last_name, player.email, player.cellphone, player.ghin_number, player.nick_name, player.handicap, player.strokes, player.photo, player.general_settings_id, player.advantage_settings_id, player.single_nassau_wagers_id, player.extra_bets_id, player.team_nassau_wagers_id, player.best_ball_teams, player.id_sync, player.ultimate_sync, player.id]).then(([tx, results]) => {
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

    updateUser(user) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE users SET name= ?, last_name= ?, email= ?, nick_name= ?, cellphone= ?, language= ?, ghin_number= ?, photo= ?, general_settings_id= ?, single_nassau_wagers_id= ?, team_nassau_wagers_id= ?, extra_bets_id= ?, stableford_settings_id= ?, id_sync= ?, ultimate_sync= ? WHERE id= ?', [user.name, user.last_name, user.email, user.nick_name, user.cellphone, user.language, user.ghin_number, user.photo, user.general_settings_id, user.single_nassau_wagers_id, user.team_nassau_wagers_id, user.extra_bets_id, user.stableford_settings_id, user.id_sync, user.ultimate_sync, user.id]).then(([tx, results]) => {
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

    updateGeneralSetting(setting) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE general_settings SET rabbit_1_6= ?, rabbit_7_12= ?, rabbit_13_18= ?, medal_play_f9= ?, medal_play_b9= ?, medal_play_18= ?, skins= ?, skins_carry_over= ?, lowed_adv_on_f9= ?, id_sync= ?, ultimate_sync= ? WHERE id= ?', [setting.rabbit_1_6, setting.rabbit_7_12, setting.rabbit_13_18, setting.medal_play_f9, setting.medal_play_b9, setting.medal_play_18, setting.skins, setting.skins_carry_over, setting.lowed_adv_on_f9, setting.id_sync, setting.ultimate_sync, setting.id]).then(([tx, results]) => {
                        resolve(results);
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
    updateSingleNassauSettings(setting){
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE single_nassau_wagers SET automatic_presses_every= ?, front_9= ?, back_9= ?, match= ?, medal= ?, total_18= ?, carry= ?, id_sync= ?, ultimate_sync= ? WHERE id= ?', [setting.automatic_presses_every, setting.front_9, setting.back_9, setting.match, setting.medal, setting.total_18, setting.carry, setting.id_sync, setting.ultimate_sync, setting.id]).then(([tx, results]) => {
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

    updateTeamNassauSettings(setting) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE team_nassau_wagers SET automatic_presses_every= ?, front_9= ?, back_9= ?, match= ?, total_18= ?, carry= ?, medal= ?, who_gets_the_adv_strokes= ?, id_sync= ?, ultimate_sync= ? WHERE id= ?', [setting.automatic_presses_every, setting.front_9, setting.back_9, setting.match, setting.total_18, setting.carry, setting.medal, setting.who_gets_the_adv_strokes, setting.id_sync, setting.ultimate_sync, setting.id]).then(([tx, results]) => {
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


    deleteCourse(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM courses WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
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

    deleteRound(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM rounds WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
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

    deleteMember(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM round_members WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
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

    deletePlayer(id) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('DELETE FROM players WHERE id = ?', [id]).then(([tx, results]) => {
                        console.log(results);
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
                   // this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

}
