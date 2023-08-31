var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleGuard = require('role.guard');
var roleUpgrader = require('role.upgrader');

const generateCreepName = () => `Creep_${Date.now()}`;


module.exports.loop = function () {
    const spawn = Game.spawns['Spawn1'];

    // 清理不再活跃的Creep内存
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 计算当前的harvester数量
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // 计算各角色的数量
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');

    // 如果某角色的数量低于期望值，则生成该角色的Creep
    if(harvesters.length < 3) {
        spawn.spawnCreep([WORK, CARRY, MOVE], generateCreepName(), { memory: { role: 'harvester' } });
    }
    else if(haulers.length < 2) {
        spawn.spawnCreep([CARRY, CARRY, MOVE, MOVE], generateCreepName(), { memory: { role: 'hauler' } });
    }
    else if(builders.length < 2) {
        spawn.spawnCreep([WORK, CARRY, MOVE], generateCreepName(), { memory: { role: 'builder' } });
    } else if(upgraders.length < 2) {
        spawn.spawnCreep([WORK, CARRY, MOVE], generateCreepName(), {memory: {role: 'upgrader'}});
    } 
    else if(repairers.length < 1) {
        spawn.spawnCreep([WORK, CARRY, MOVE], generateCreepName(), { memory: { role: 'repairer' } });
    }
    else if(guards.length < 2) {
        spawn.spawnCreep([ATTACK, MOVE], generateCreepName(), { memory: { role: 'guard' } });
    }

    if (harvesters.length < 2) { // 你可以更改这里的数字来确定你想要维护的harvester数量
        const body = [WORK, CARRY, MOVE];
        const newName = generateCreepName();
        if(spawn.spawnCreep(body, newName, {memory: {role: 'harvester'}}) == OK) {
            console.log('Spawning new harvester: ' + newName);
        }
    }

    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'hauler':
                roleHauler.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'guard':
                roleGuard.run(creep);
                break;
        }
    }
}
