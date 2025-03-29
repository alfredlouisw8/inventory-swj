import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ConsolidatorForm from './form'
export default function AddConsolidatorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Consolidator</DialogTitle>
        </DialogHeader>
        <ConsolidatorForm
          type="create"
          successMessage="Consolidator berhasil ditambahkan"
        />
      </DialogContent>
    </Dialog>
  )
}
