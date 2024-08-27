import React, { Fragment } from 'react'
import Head from 'next/head'

import { DataProvider, Repeater } from '@teleporthq/react-components'
import PropTypes from 'prop-types'
import {
  getEntitiesWithPagination,
  getEntities,
} from '@teleporthq/cms-mappers/caisy'

const Author11 = (props) => {
  return (
    <>
      <div className="author11-container1">
        <Head>
          <title>Author1 - Central Implementation Liaison</title>
          <meta
            property="og:title"
            content="Author1 - Central Implementation Liaison"
          />
        </Head>
        <DataProvider
          renderSuccess={(params) => (
            <Fragment>
              <div className="author11-container2">
                <Repeater
                  items={params}
                  renderItem={(AuthorEntities) => (
                    <Fragment>
                      <div className="author11-container3">
                        <h1>{AuthorEntities?.name}</h1>
                        <span>{AuthorEntities?.name}</span>
                        <span>{AuthorEntities?.id}</span>
                      </div>
                    </Fragment>
                  )}
                />
              </div>
            </Fragment>
          )}
          initialData={props.authorEntities}
          persistDataDuringLoading={true}
          key={props?.pagination?.page}
        />
      </div>
      <style jsx>
        {`
          .author11-container1 {
            width: 100%;
            display: flex;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .author11-container2 {
            display: flex;
            flex-direction: column;
          }
          .author11-container3 {
            gap: 12px;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
}

Author11.defaultProps = {
  authorEntities: [],
}

Author11.propTypes = {
  authorEntities: PropTypes.array,
}

export default Author11

export async function getStaticProps(context) {
  try {
    const response = await getEntitiesWithPagination({
      ...context?.params,
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query:
        'query MyQuery($first: Int, $after: String){allAuthor(first: $first, after: $after){pageInfo{endCursor,hasNextPage,hasPreviousPage}edges{node{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}}}',
      page: context.params.page,
      perPage: 10,
    })
    if (!response) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        authorEntities: response,
        ...response?.meta,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  try {
    const response = await getEntities({
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query: '{allAuthor{edges{node{id}}}}',
    })
    const totalCount = response?.meta?.pagination?.total
    const pagesCount = Math.ceil(totalCount / 10)
    return {
      paths: Array.from(
        {
          length: pagesCount,
        },
        (_, i) => ({
          params: {
            page: (i + 1).toString(),
          },
        })
      ),
      fallback: 'blocking',
    }
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}
