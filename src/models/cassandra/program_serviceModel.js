const schemaData= {
  keyspace_name: 'sunbird_programs',
  column_families: [
    {
      table_name: 'program',
      fields: {
        program_id: 'text',
        name: 'text',
        description: 'text',
        startdate: {
          type: 'timestamp',
          default: {
            '$db_function': 'toTimestamp(now())'
          }
        },
        enddate: 'timestamp',
        nomination_enddate: 'timestamp',
        shortlisting_enddate: 'timestamp',
        content_submission_enddate: 'timestamp',
        status: 'text',
        type: 'text',
        config: 'text',
        slug: 'text',
        default_roles: {
          type: 'list',
          typeDef: '<text>'
        },
        rootorg_id: 'text',
        rootorg_name: 'text',
        image_path: 'text',
      },
      key: ['program_id']
    },
    {
      table_name: 'participants',
      fields: {
        program_id: 'text',
        user_id: 'text',
        enrolled_on: {
          type: 'timestamp',
          default: {
            '$db_function': 'toTimestamp(now())'
          }
        },
        roles: {
          type: 'list',
          typeDef: '<text>'
        },
        onboarding_data: 'text',
        onboarded: 'boolean'
      },
      key: ['program_id', 'user_id']
    }
  ]
}

module.exports =  schemaData;
