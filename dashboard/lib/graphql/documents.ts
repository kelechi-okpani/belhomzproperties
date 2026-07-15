import { gql } from "@apollo/client";


export const ANALYTICS_QUERY = gql`
query Analytics {
  analytics {
    todaysLeadCount
    propertyAvailability {
      available
      reserved
      sold
    }
    myActivityStats {
      total
      byType {
        type
        count
      }
    }
    recentActivity {
      id
      type
      message
      entityType
      entityId
      actor
      createdAt
    }
    salesFunnel {
      stage
      count
    }
    topAgents {
      agentId
      count
    }
    agentLeaderboard {
      agentId
      agentName
      totalLeads
      byStage {
        stage
        count
      }
      closedWon
      closedLost
      conversionRate
    }
    revenueTrend {
      month
      total
    }
    monthlyRevenue
    pendingPayments {
      id
      clientName
      clientPhone
      property
      lead
      totalAmount
      amountPaid
      method
      installments {
        id
        amount
        dueDate
        status
        paidAt
      }
      recordedBy
      createdAt
      updatedAt
    }
    overduePayments {
      id
      clientName
      clientPhone
      property
      lead
      totalAmount
      amountPaid
      method
      installments {
        id
        amount
        dueDate
        status
        paidAt
      }
      recordedBy
      createdAt
      updatedAt
    }
    myPerformance {
      agentId
      agentName
      totalLeads
      byStage {
        stage
        count
      }
      closedWon
      closedLost
      conversionRate
    }
  }
}
`;

export const ACTIVITY_FEED_SUBSCRIPTION = gql`
  subscription OnActivity {
    activityFeed {
      id
      type
      message
      entityType
      entityId
      createdAt
    }
  }
`;




export const PROPERTIES_QUERY = gql`
  query Properties($filter: PropertyFilterInput) {
    properties(filter: $filter) {
      items {
        id
        title
        description
        price
        location
        type
        size
        amenities
        status
        images {
          url
          publicId
        }
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const PROPERTY_DETAIL_QUERY = gql`
  query Property($propertyId: ID!) {
    property(id: $propertyId) {
      id
      title
      description
      price
      location
      type
      size
      amenities
      status
      images {
        url
        publicId
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROPERTY_MUTATION = gql`
  mutation CreateProperty($input: CreatePropertyInput!) {
    createProperty(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_PROPERTY_STATUS_MUTATION = gql`
  mutation UpdatePropertyStatus($updatePropertyStatusId: ID!, $status: PropertyStatus!) {
    updatePropertyStatus(id: $updatePropertyStatusId, status: $status) {
      id
      title
      status
    }
  }
`;

export const UPDATE_PROPERTY_MUTATION = gql`
  mutation UpdateProperty($updatePropertyId: ID!, $input: UpdatePropertyInput!) {
    updateProperty(id: $updatePropertyId, input: $input) {
      id
      title
      description
      price
      location
      type
      size
      amenities
      status
      images {
        url
        publicId
      }
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROPERTY_MUTATION = gql`
  mutation DeleteProperty($deletePropertyId: ID!) {
    deleteProperty(id: $deletePropertyId)
  }
`;








export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
      phone
      isActive
    }
  }
`;







export const CREATE_LEAD_MUTATION = gql`
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(input: $input) {
      id
    }
  }
`;

export const UPDATE_LEAD_STAGE = gql`
  mutation UpdateLeadStage($id: ID!, $stage: LeadStage!) {
    updateLeadStage(id: $id, stage: $stage) {
      id
      stage
    }
  }
`;

export const LEADS_QUERY = gql`
  query Leads($filter: LeadFilterInput) {
    leads(filter: $filter) {
      id
      clientName
      clientPhone
      stage
      assignedAgent
      createdAt
      inspection {
        scheduledAt
        location
      }
    }
  }
`;

export const LEAD_DETAIL_QUERY = gql`
  query LeadDetail($id: ID!) {
    lead(id: $id) {
      id
      clientName
      clientPhone
      clientEmail
      property
      assignedAgent
      stage
      activities {
        note
        createdBy
        createdAt
      }
      inspection {
        scheduledAt
        location
        notes
        completed
      }
      createdAt
    }
  }
`;





export const SCHEDULE_INSPECTION_MUTATION = gql`
  mutation ScheduleInspection($id: ID!, $input: ScheduleInspectionInput!) {
    scheduleInspection(id: $id, input: $input) {
      id
      stage
      inspection {
        scheduledAt
        location
      }
    }
  }
`;




export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
    }
  }
`;

export const PAYMENTS_QUERY = gql`
  query Payments {
    payments {
      id
      clientName
      totalAmount
      amountPaid
      method
      installments {
        id
        amount
        dueDate
        status
      }
    }
  }
`;

export const RECORD_INSTALLMENT_PAYMENT_MUTATION = gql`
  mutation RecordInstallmentPayment($paymentId: ID!, $installmentId: ID!, $amount: Float!) {
    recordInstallmentPayment(paymentId: $paymentId, installmentId: $installmentId, amount: $amount) {
      id
      amountPaid
      installments {
        id
        status
      }
    }
  }
`;




export const STAFF_QUERY = gql`
  query Staff {
    staff {
      id
      name
      email
      role
      phone
      isActive
    }
  }
`;

export const CHANGE_USER_ROLE_MUTATION = gql`
  mutation ChangeUserRole($id: ID!, $role: UserRole!) {
    changeUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      id
      isActive
    }
  }
`;

export const REACTIVATE_USER_MUTATION = gql`
  mutation ReactivateUser($id: ID!) {
    reactivateUser(id: $id) {
      id
      isActive
    }
  }
`;



export const ADD_LEAD_ACTIVITY_MUTATION = gql`
  mutation AddLeadActivity($id: ID!, $note: String!) {
    addLeadActivity(id: $id, note: $note) {
      id
      activities {
        note
        createdAt
      }
    }
  }
`;

export const ACTIVITIES_HISTORY_QUERY = gql`
  query ActivitiesHistory($limit: Int) {
    activities(limit: $limit) {
      id
      type
      message
      entityType
      entityId
      actor
      createdAt
    }
  }
`;


export const GET_INSTAGRAM_FEED = gql`
    query GetInstagramFeed($page: Int, $limit: Int) {
      getInstagramFeed(page: $page, limit: $limit) {
        posts {
          _id
          instagramId
          caption
          mediaType
          mediaUrl
          permalink
          thumbnailUrl
          timestamp
          lastSyncedAt
        }
        pagination {
          total
          page
          pages
        }
      }
    }

`
//GET_INSTAGRAM_FEED, SYNC_INSTAGRAM_FEED



export const ALL_AGENT_PERFORMANCE_QUERY = gql`
  query AllAgentPerformance {
    allAgentPerformance {
      agentId
      agentName
      totalLeads
      closedWon
      closedLost
      conversionRate
    }
  }
`;

export const MY_PERFORMANCE_QUERY = gql`
  query MyPerformance {
    myPerformance {
      agentId
      totalLeads
      closedWon
      closedLost
      conversionRate
      byStage {
        stage
        count
      }
    }
  }
`

export const MY_ACTIVITY_STATS_QUERY = gql`
  query MyActivityStats($days: Int) {
    myActivityStats(days: $days) {
      total
      byType {
        type
        count
      }
    }
  }
`;

export const REVENUE_TREND_QUERY = gql`
  query RevenueTrend($months: Int) {
    revenueTrend(months: $months) {
      month
      total
    }
  }
`;
