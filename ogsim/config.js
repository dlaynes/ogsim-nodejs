//Ogame data!!
exports.pricelist = {
    "1" : {'id':"1", 'name':'planet', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    "2" : {'id':"2", 'name':'moon', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    "3" : {'id':"3", 'name':'debris', 'metal':0, 'crystal':0, 'deuterium':0, 'size':0,"position": null},
    
    "109": {"id":"109", "name":"military_tech"},
    "110": {"id":"110", "name":"defense_tech"},
    "111": {"id":"111", "name":"hull_tech"},

    "202": {"id":"202", "name":"small_cargo", "metal":2000,"crystal":2000,"deuterium":0,"energy":0,"factor":1,"consumption":10,"speed":5000,"capacity":5000, "attack":5.0, "defense":10.0, "hull":4000.0 , "motor":115 , "motor2": {117:4}, "speed2":10000,"consumption2":20 },
    "203": {"id":"203", "name":"large_cargo", "metal":6000,"crystal":6000,"deuterium":0,"energy":0,"factor":1,"consumption":50,"speed":8000,"capacity":25000, "attack":5.0, "defense":25.0, "hull":12000.0 , "motor":115 },
    "204": {"id":"204", "name":"light_fighter", "metal":3000,"crystal":1000,"deuterium":0,"energy":0,"factor":1,"consumption":20,"speed":12500,"capacity":50, "attack":50.0, "defense":10.0, "hull":4000.0 , "motor":115 },
    "205": {"id":"205", "name":"heavy_fighter", "metal":6000,"crystal":4000,"deuterium":0,"energy":0,"factor":1,"consumption":75,"speed":10000,"capacity":100, "attack":150.0, "defense":25.0, "hull":10000.0 , "motor":117 },
    "206": {"id":"206", "name":"cruiser", "metal":20000,"crystal":7000,"deuterium":2000,"energy":0,"factor":1,"consumption":300,"speed":15000,"capacity":800, "attack":400.0, "defense":50.0, "hull":27000.0 , "motor":117 },
    "207": {"id":"207", "name":"battle_ship", "metal":45000,"crystal":15000,"deuterium":0,"energy":0,"factor":1,"consumption":500,"speed":10000,"capacity":1500, "attack":1000.0, "defense":200.0, "hull":60000.0 , "motor":118},
    "208": {"id":"208", "name":"colony_ship", "metal":10000,"crystal":20000,"deuterium":10000,"energy":0,"factor":1,"consumption":1000,"speed":2500,"capacity":7500, "attack":50.0, "defense":100.0, "hull":30000.0 , "motor":117},
    "209": {"id":"209", "name":"recycler", "metal":10000,"crystal":6000,"deuterium":2000,"energy":0,"factor":1,"consumption":300,"speed":2000,"capacity":20000, "attack":1.0, "defense":10.0, "hull":16000.0 , "motor":115},
    "210": {"id":"210", "name":"esp_probe", "metal":0,"crystal":1000,"deuterium":0,"energy":0,"factor":1,"consumption":1,"speed":1000000,"capacity":5, "attack":0.01, "defense":0.01, "hull":1000.0 , "motor":115 },
    "211": {"id":"211", "name":"bomber_ship", "metal":50000,"crystal":25000,"deuterium":15000,"energy":0,"factor":1,"consumption":1000,"speed":4000,"capacity":500, "attack":1000.0, "defense":500.0, "hull":75000.0 , "motor":117, "motor2": {118:7}, "speed2":5000 },
    "212": {"id":"212", "name":"solar_sat", "metal":0,"crystal":2000,"deuterium":500,"energy":0,"factor":1, "consumption": 0, "speed":0, "capacity":0, "attack":1.0, "defense":1.0, "hull":2000.0 , "motor": -1},
    "213": {"id":"213", "name":"destroyer", "metal":60000,"crystal":50000,"deuterium":15000,"energy":0,"factor":1,"consumption":1000,"speed":5000,"capacity":2000, "attack":2000.0, "defense":500.0, "hull":110000.0 , "motor":118},
    "214": {"id":"214", "name":"death_star", "metal":5000000,"crystal":4000000,"deuterium":1000000,"energy":0,"factor":1,"consumption":1,"speed":100,"capacity":1000000, "attack":200000.0, "defense":50000.0, "hull":9000000.0 , "motor":118},
    "215": {"id":"215", "name":"battle_cruiser", "metal":30000,"crystal":40000,"deuterium":15000,"energy":0,"factor":1,"consumption":250,"speed":10000,"capacity":750, "attack":700.0, "defense":400.0, "hull":70000.0 , "motor":118},

    "401": {"id":"401", "name":"rocket_launcher", "metal":2000,"crystal":0,"deuterium":0,"energy":0,"factor":1, "attack":80, "defense":20, "hull":2000},
    "402": {"id":"402", "name":"light_laser", "metal":1500,"crystal":500,"deuterium":0,"energy":0,"factor":1, "attack":100, "defense":25, "hull":2000},
    "403": {"id":"403", "name":"heavy_laser", "metal":6000,"crystal":2000,"deuterium":0,"energy":0,"factor":1, "attack":250, "defense":100, "hull":8000},
    "404": {"id":"404", "name":"gauss_cannon", "metal":20000,"crystal":15000,"deuterium":2000,"energy":0,"factor":1, "attack":1100, "defense":200, "hull":35000},
    "405": {"id":"405", "name":"ion_cannon", "metal":2000,"crystal":6000,"deuterium":0,"energy":0,"factor":1, "attack":150, "defense":500, "hull":8000},
    "406": {"id":"406", "name":"plasma_turret", "metal":50000,"crystal":50000,"deuterium":30000,"energy":0,"factor":1, "attack":3000, "defense":300, "hull":100000},
    "407": {"id":"407", "name":"small_shield_dome", "metal":10000,"crystal":10000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":2000, "hull":20000},
    "408": {"id":"408", "name":"large_shield_dome", "metal":50000,"crystal":50000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":10000, "hull":100000},

    "502": {"id":"502", "name":"antiballistic_missile", "metal":8000,"crystal":2000,"deuterium":0,"energy":0,"factor":1, "attack":1, "defense":1, "hull":8000},
    "503": {"id":"503", "name":"interplanetary_missile", "metal":12500,"crystal":2500,"deuterium":10000,"energy":0,"factor":1, "attack":12000, "defense":1, "hull":15000}
};

exports.rapidfire = {
    "202": {"210":5,"212":5},
    "203": {"210":5,"212":5},
    "204": {"210":5,"212":5},
    "205": {"210":5,"212":5,"203":3},
    "206": {"210":5,"212":5,"204":6,"401":10},
    "207": {"210":5,"212":5},
    "208": {"210":5,"212":5},
    "209": {"210":5,"212":5},
    "210": {},
    "211": {"210":5,"212":5,"401":120,"402":120,"403":10,"405":10},
    "212": {},
    "213": {"210":5,"212":5,"215":3,"402":10},
    "214": {"210":1250,"212":1250,"202":250,"203":250,"204":200,"205":100,"206":33,"207":30,"208":250,"209":250,"211":25,"213":5,"215":15,"401":200,"402":200,"403":100,"404":50,"405":100},
    "215": {"202":3,"203":3,"206":5,"207":8},
};

exports.lang = {
    
};