import { SearchController } from '../search/search.controller'

function lean<T>(data: T) {
  return { lean: async () => data }
}

describe('SearchController.results', () => {
  test('filters by practice, applies year range, sorts, and computes rating avg', async () => {
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

    const q = { practice: 'TDD', yearFrom: 2020, sort: 'year', columns: 'title,year,rating' }
    const res = await controller.results(q as any)

    expect(res.cols).toEqual(['title', 'year', 'rating'])
    expect(res.rows.length).toBe(1)
    expect(res.rows[0]).toMatchObject({
      _id: a1,
      title: 'Paper A',
      authors: ['Alice'],
      year: 2021,
      journal: 'J1',
      practice: 'TDD',
      claim: 'Quality'
    })
    expect(res.rows[0].rating).toBe(4)
  })
})

