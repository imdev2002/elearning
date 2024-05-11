'use client'

import ActionRequestModal from '@/app/(manager)/forms/_components/action-request-modal'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { EyeIcon } from 'lucide-react'

type Props = {
  data: any
}

const RequestsTable = ({ data }: Props) => {
  return (
    <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>REQUEST AT</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No pending request'}>
        {data.map((form: any, index: number) => (
          <TableRow key="1">
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar
                  src={generateMediaLink(form.selfie)}
                  name={displayFullname(
                    form.real_firstName,
                    form.real_lastName
                  )}
                />
                <p>
                  {displayFullname(form.real_firstName, form.real_lastName)}
                </p>
              </div>
            </TableCell>
            <TableCell>{form.category}</TableCell>
            <TableCell>
              {formatDate(new Date(form.timestamp), 'MM/dd/yyyy')}
            </TableCell>
            <TableCell>
              <ActionRequestModal data={form} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RequestsTable
