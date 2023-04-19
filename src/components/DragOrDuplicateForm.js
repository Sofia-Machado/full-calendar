import { Box, Button, Modal} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useQueryClient } from 'react-query';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DragOrDuplicateForm({ addNewEvent, eventInfo, oldEventDrag, openDragForm, setOpenDragForm, updateExistingEvent }) {

  const queryClient = useQueryClient();
  const handleClose = () => setOpenDragForm(false);
 
  const handleReplace = () => {
    if (eventInfo) {
      updateExistingEvent(eventInfo)
    }
    setOpenDragForm(false)
  }
  const handleAdd = () => {
    if (eventInfo) {
      addNewEvent({
        ...eventInfo,
        id: eventInfo.id + 'duplicate'
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries('events')
        }
      })
    }
    updateExistingEvent({...oldEventDrag, classNames: 'duplicate'}, {
      onSuccess: () => {
        queryClient.invalidateQueries('events')
      }
    });
    setOpenDragForm(false)
  }

  const handleNo = () => {
    updateExistingEvent(oldEventDrag, {
      onSuccess: () => {
        queryClient.invalidateQueries('events')
      }
    })
    setOpenDragForm(false)
  }

  return (
    <div>
      <Modal
        open={openDragForm}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        {eventInfo?.extendedProps?.mandatory ? 
        (
        <>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Do you want to duplicate the event?
          </Typography>
          <div className='duplicate-drag-buttons'>
            <Button onClick={handleAdd} sx={{ mt: 2 }}>
              Yes 
            </Button>
            <Button onClick={handleNo} sx={{ mt: 2 }}>
              No
            </Button>
          </div>
        </>
        )
        :
        (
        <>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Do you want to duplicate the event or replace it?
          </Typography>
          <div className='duplicate-drag-buttons'>
            <Button onClick={handleAdd} sx={{ mt: 2 }}>
              Duplicate 
            </Button>
            <Button onClick={handleReplace} sx={{ mt: 2 }}>
              Replace
            </Button>
          </div>
        </>
        )
        }
          
        </Box>
      </Modal>
    </div>
  );
}