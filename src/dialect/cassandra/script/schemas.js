
const v3 = {
    local: {
        fields: [
            'key','bootstrapped','broadcast_address','cluster_name','cql_version','data_center',
            'gossip_generation','host_id','listen_address','native_protocol_version','partitioner',
            'rack','release_version','rpc_address','schema_version','thrift_version'
        ],
        handler: row => {
            return {
                version: row['release_version'],
                properties: {
                    dataCenter: row['data_center'],
                    clusterName: row['cluster_name'],
                    partitioner: row['partitioner'],
                    schemaVersion: row['schema_version']
                }
            }
        }
    },
    catalogs: {
        fields: ['keyspace_name','durable_writes','replication'],
        handler: row => {
            return {
                name: row['keyspace_name'],
                properties: {
                    durable_rites: row['durable_writes'],
                    replication: row['replication']
                }
            }
        }
    },
    tables: {
        fields: [
            'keyspace_name','table_name','bloom_filter_fp_chance','cdc','comment','crc_check_chance',
            'dclocal_read_repair_chance','default_time_to_live','gc_grace_seconds','id','max_index_interval',
            'memtable_flush_period_in_ms','min_index_interval','read_repair_chance','speculative_retry',
            'caching', 'compaction', 'compression', 'extensions', 'flags'
        ],
        handler: row => {
            return {
                catalog: row['keyspace_name'],
                name: row['table_name'],
                properties: {
                    bloom_filter_fp_chance: row['bloom_filter_fp_chance'],
                    cdc: row['cdc'],
                    crc_check_chance: row['crc_check_chance'],
                    dclocal_read_repair_chance: row['dclocal_read_repair_chance'],
                    default_time_to_live: row['default_time_to_live'],
                    gc_grace_seconds: row['gc_grace_seconds'],
                    max_index_interval: row['max_index_interval'],
                    read_repair_chance: row['read_repair_chance'],
                    speculative_retry: row['speculative_retry'],
                    caching: row['caching'],
                    compaction: row['compaction'],
                    compression: row['compression'],
                    extensions: row['extensions'],
                    flags: row['flags']
                }
            }
        }
    },
    columns: {
        fields: [
            'keyspace_name','table_name','column_name','clustering_order',
            'column_name_bytes','kind','position','type'
        ],
        handler: row => {
            return {
                catalog: row['keyspace_name'],
                table: row['table_name'],
                name: row['column_name'],
                kind: row['kind'],
                type: row['type'],
                clusteringOrder: row['clustering_order']
            }
        }
    },
}

const v4 = {
    local: {
        fields: [
            'key', 'bootstrapped', 'broadcast_address', 'broadcast_port', 'cluster_name', 'cql_version', 
            'data_center', 'gossip_generation', 'host_id', 'listen_address', 'listen_port', 'native_protocol_version',
             'partitioner', 'rack', 'release_version', 'rpc_address', 'rpc_port', 'schema_version'
        ],
        handler: row => {
            return {
                version: row['release_version'],
                properties: {
                    dataCenter: row['data_center'],
                    clusterName: row['cluster_name'],
                    partitioner: row['partitioner'],
                    schemaVersion: row['schema_version']
                }
            }
        }
    },
    catalog: {
        fields: ['keyspace_name', 'durable_writes', 'replication'],
        handler: row => {
            return {
                name: row['keyspace_name'],
                properties: {
                    durable_rites: row['durable_writes'],
                    replication: row['replication']
                }
            }
        }
    },
    tables: {
        fields: [
            'keyspace_name', 'table_name', 'additional_write_policy', 'bloom_filter_fp_chance', 'cdc', 
            'comment', 'crc_check_chance', 'dclocal_read_repair_chance', 'default_time_to_live', 'gc_grace_seconds', 
            'id', 'max_index_interval', 'memtable_flush_period_in_ms', 'min_index_interval', 
            'read_repair', 'read_repair_chance', 'speculative_retry',
            'caching', 'compaction', 'compression', 'extensions', 'flags'
        ],
        handler: row => {
            return {
                catalog: row['keyspace_name'],
                name: row['table_name'],
                properties: {
                    additional_write_policy: row['additional_write_policy'],
                    bloom_filter_fp_chance: row['bloom_filter_fp_chance'],
                    cdc: row['cdc'],
                    crc_check_chance: row['crc_check_chance'],
                    dclocal_read_repair_chance: row['dclocal_read_repair_chance'],
                    default_time_to_live: row['default_time_to_live'],
                    gc_grace_seconds: row['gc_grace_seconds'],
                    max_index_interval: row['max_index_interval'],
                    read_repair: row['read_repair'],
                    read_repair_chance: row['read_repair_chance'],
                    speculative_retry: row['speculative_retry'],
                    caching: row['caching'],
                    compaction: row['compaction'],
                    compression: row['compression'],
                    extensions: row['extensions'],
                    flags: row['flags']
                }
            }
        }
    },
    columns: {
        fields: [
            'keyspace_name', 'table_name', 'column_name', 'clustering_order',
            'column_name_bytes', 'kind', 'position', 'type'
        ],
        handler: row => {
            return {
                catalog: row['keyspace_name'],
                table: row['table_name'],
                name: row['column_name'],
                kind: row['kind'],
                type: row['type'],
                clusteringOrder: row['clustering_order']
            }
        }
    }
}

module.exports = {
    v3: v3,
    v4: v4
}