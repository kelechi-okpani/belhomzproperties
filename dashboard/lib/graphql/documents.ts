import { gql } from "@apollo/client";



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





// PROPERTIES START --- HERE

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
  mutation UpdateProperty($input: UpdatePropertyInput!, $updatePropertyId: ID!) {
  updateProperty(input: $input, id: $updatePropertyId) {
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


// PROPERTIES ENDS --- HERE



// LEADS & CLIENTS START --- HERE

export const CREATE_LEAD_MUTATION = gql`
    mutation CreateLead($input: CreateLeadInput!) {
          createLead(input: $input) {
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
            updatedAt
          }
        }
`;

export const UPDATE_LEAD_MUTATION = gql`
    mutation UpdateLead($input: UpdateLeadInput!, $updateLeadId: ID!) {
          updateLead(input: $input, id: $updateLeadId) {
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
            updatedAt
          }
        }
`;


export const UPDATE_LEAD_STAGE = gql`
    mutation UpdateLeadStage($updateLeadStageId: ID!, $stage: LeadStage!) {
  updateLeadStage(id: $updateLeadStageId, stage: $stage) {
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
    updatedAt
  }
}
`


export const LEADS_QUERY = gql`
   query Leads($filter: LeadFilterInput) {
  leads(filter: $filter) {
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
    updatedAt
  }
}
`;

export const LEAD_DETAIL_QUERY = gql`
  query Lead($leadId: ID!) {
  lead(id: $leadId) {
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
    updatedAt
  }
}
`;

export const SCHEDULE_INSPECTION_MUTATION = gql`
    mutation ScheduleInspection($input: ScheduleInspectionInput!, $scheduleInspectionId: ID!) {
      scheduleInspection(input: $input, id: $scheduleInspectionId) {
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
        updatedAt
      }
    }
`;

export const ADD_LEAD_ACTIVITY_MUTATION = gql`
    mutation AddLeadActivity($addLeadActivityId: ID!, $note: String!) {
      addLeadActivity(id: $addLeadActivityId, note: $note) {
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
        updatedAt
      }
}
`


// LEADS & CLIENTS      ENDS --- HERE















// PAYMENTS    START --- HERE

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

// PAYMENTS    ENDS --- HERE


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




export const ACTIVITIES_HISTORY_QUERY = gql`
  query Activities($limit: Int) {
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

export const ACTIVITY_FEED_SUBSCRIPTION = gql`
  subscription ActivityFeed {
    activityFeed {
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

export const GET_ENQUIRIES = gql`
query GetEnquiries($page: Int, $limit: Int, $status: EnquiryStatus) {
  getEnquiries(page: $page, limit: $limit, status: $status) {
    enquiries {
      _id
      fullName
      email
      phone
      subject
      message
      status
      createdAt
      updatedAt
    }
    pagination {
      total
      page
      pages
    }
  }
}
`


export const GET_ENQUIRY_BY_ID = gql`
query GetEnquiryById($getEnquiryByIdId: ID!) {
  getEnquiryById(id: $getEnquiryByIdId) {
    _id
    fullName
    email
    phone
    subject
    message
    status
    createdAt
    updatedAt
  }
}

`


// GET_ENQUIRIES, GET_ENQUIRY_BY_ID



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




