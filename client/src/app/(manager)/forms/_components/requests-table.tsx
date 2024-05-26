'use client'

import ActionRequestModal from '@/app/(manager)/forms/_components/action-request-modal'
import { displayFullname, generateMediaLink } from '@/lib/utils'
import { formApiRequest } from '@/services/form.service'
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
  data: any
}

const RequestsTable = ({ data }: Props) => {
  const { refresh } = useRouter()
  const updateRequest = async (id: number, status: string) => {
    try {
      const res = await formApiRequest.update(id, { status })
      if (res.status === 200) {
        toast.success('Request updated successfully')
        refresh()
      }
    } catch (error) {}
  }
  return (
    <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>REQUEST AT</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
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
              {formatDate(new Date(form.updatedAt), 'MM/dd/yyyy')}
            </TableCell>
            <TableCell className="flex gap-2 items-center">
              <ActionRequestModal data={form} />
              <Tooltip content="Accept">
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  color="success"
                  onClick={() => updateRequest(form.id, 'APPROVED')}
                >
                  <Check size={16} />
                </Button>
              </Tooltip>
              <Tooltip content="Reject">
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  color="danger"
                  onClick={() => updateRequest(form.id, 'REJECTED')}
                >
                  <X size={16} />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RequestsTable
