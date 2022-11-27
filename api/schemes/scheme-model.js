const db = require('../../data/db-config')

function find() { 
  
return db('schemes as sc')
.leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
.select('sc.*', 'st.step_id')
.count('st.step_id as number_of_steps')
.groupBy('sc.scheme_id')
.orderBy('sc.scheme_id', 'asc')
}
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */



async function findById(scheme_id) { // EXERCISE B

try { const dbRes = await db('schemes as sc')
  .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
  .select('sc.scheme_name', 'st.*')
  .where('sc.scheme_id', scheme_id)
  .orderBy('st.step_number', 'ASC')
  const result = {
    scheme_id: dbRes[0].scheme_id, 
    scheme_name: dbRes[0].scheme_name,
    steps: []
  }
  
  for (const row of dbRes) {
    if (row.step_id != null) {
      result.steps.push({step_id: row.step_id, step_number: row.step_number, instructions: row.instructions})
    }
  }
  return result
} catch {
  return null
}
}
  // {
  //   "scheme_id": 1,
  //   "scheme_name": "World Domination",
  //   "steps": [
  //     {
  //       "step_id": 2,
  //       "step_number": 1,
  //       "instructions": "solve prime number theory"
  //     },
  //     {
  //       "step_id": 1,
  //       "step_number": 2,
  //       "instructions": "crack cyber security"
  //     },
  //     // etc
  //   ]
  // }
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

    

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */


async function findSteps(scheme_id) { // EXERCISE C
 try { const dbRes = await db('schemes as sc')
.leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
.where('sc.scheme_id', scheme_id)
.orderBy('st.step_number', 'asc')

const result = []

for (const row of dbRes) {
  if (row.step_id != null) {
    result.push({step_id: row.step_id, step_number: row.step_number, instructions: row.instructions, scheme_name: row.scheme_name})
  }
}

return result }
catch{ return null}
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

function add(scheme) { // EXERCISE D
  return db('schemes').insert(scheme)
  .then(([scheme_id]) => {
    return db('schemes').where('scheme_id', scheme_id).first();
  })
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
  return db('steps').insert({...step, scheme_id})
  .then(() => {return db('steps').where('scheme_id', scheme_id).orderBy('step_number', 'ASC')
})

}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
