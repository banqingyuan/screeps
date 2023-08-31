// role.builder.js

var roleBuilder = {
    run: function(creep) {
        // 如果建造并且能量为0，停止建造
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        // 如果不建造并且能量满了，开始建造
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        // 建造逻辑
        if(creep.memory.building) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // 没有建筑工地时，变为修理工
                var structureToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
                });
                if(structureToRepair) {
                    if(creep.repair(structureToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureToRepair, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            // 从最近的能量源获取能量
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
