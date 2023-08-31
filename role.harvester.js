// role.harvester.js

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // 如果 Creep 的能量为空，将其设置为采集状态
        if(creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
        }
        // 如果 Creep 的能量满了，将其设置为非采集状态
        else if(creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }


        // 根据采集者的状态决定行动
        if(creep.memory.harvesting) {
            // 找到最近的能量源
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            // 将能量传输到最近的 Spawn
            var closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            if(closestSpawn && creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSpawn, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
