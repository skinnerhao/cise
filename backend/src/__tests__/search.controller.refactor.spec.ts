import { SearchController } from '../search/search.controller'

function lean<T>(data: T) {
  return { lean: async () => data }
}

function setup() {
  const a1 = 'a1'
  const a2 = 'a2'
  const evidences = [
    { article: a1, practice: 'TDD', claim: 'Quality', result: 'Support', studyType: 'Case', participantType: 'Dev' },
    { article: a2, practice: 'Code Review', claim: 'Velocity', result: 'Neutral', studyType: 'Survey', participantType: 'Team' }
  ]
  const articles = [
    { _id: a1, title: 'Paper A', authors: ['Alice'], year: 2021, journal: 'J1' },
    { _id: a2, title: 'Paper B', authors: ['Bob'], year: 2019, journal: 'J2' }
  ]
  const ratings = [
    { article: a1, stars: 5 },
    { article: a1, stars: 3 },
    { article: a2, stars: 4 }
  ]

  const evidenceModel = {
    find: (filter: any) => {
      const data = evidences.filter(ev => {
        if (filter.practice && ev.practice !== filter.practice) return false
        if (filter.claim && ev.claim !== filter.claim) return false
        return true
      })
      return lean(data)
    }
  }

  const articleModel = {
    find: (query: any) => {
      const ids: string[] = query?._id?.$in || []
      const data = articles.filter(a => ids.includes(String(a._id)))
      return lean(data)
    }
  }

  const ratingModel = {
    aggregate: async (pipeline: any[]) => {
      const matchIds: string[] = pipeline?.[0]?.$match?.article?.$in || []
      const data = ratings.filter(r => matchIds.includes(String((r as any).article)))
      const byArticle = new Map<string, number[]>()
      for (const r of data) {
        const key = String((r as any).article)
        const arr = byArticle.get(key) || []
        arr.push((r as any).stars)
        byArticle.set(key, arr)
      }
      return Array.from(byArticle.entries()).map(([id, arr]) => ({ _id: id, avg: arr.reduce((s, v) => s + v, 0) / arr.length }))
    }
  }

  const taxonomyModel = { findOne: () => lean({ practices: ['TDD'], claims: [{ practice: 'TDD', text: 'Quality' }] }) }
  const savedQueryModel = { create: async () => {} }

  const controller = new SearchController(
    evidenceModel as any,
    articleModel as any,
    taxonomyModel as any,
    ratingModel as any,
    savedQueryModel as any
  )

  return { controller, a1, a2, articles }
}

describe('SearchController.results (REFACTOR)', () => {
  test('filters by practice', async () => {
    const { controller, a1 } = setup()
    const res = await controller.results({ practice: 'TDD' } as any)
    expect(res.rows.length).toBe(1)
    expect(res.rows[0]._id).toBe(a1)
  })

  test('applies year range (yearFrom)', async () => {
    const { controller, a1 } = setup()
    const res = await controller.results({ yearFrom: 2020 } as any)
    expect(res.rows.length).toBe(1)
    expect(res.rows[0]._id).toBe(a1)
  })

  test('sorts results by year ascending', async () => {
    const { controller } = setup()
    const res = await controller.results({ sort: 'year' } as any)
    const years = res.rows.map(r => r.year)
    expect(years).toEqual([2019, 2021])
    const titles = res.rows.map(r => r.title)
    expect(titles).toEqual(['Paper B', 'Paper A'])
  })

  test('computes rating average', async () => {
    const { controller } = setup()
    const res = await controller.results({ practice: 'TDD', columns: 'title,year,rating' } as any)
    expect(res.cols).toEqual(['title', 'year', 'rating'])
    expect(res.rows[0].rating).toBe(4)
  })
})

