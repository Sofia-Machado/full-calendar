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
  borderRadius: 5
};

export default function DragOrDuplicateForm ({ addNewEvent, eventInfo, oldEventDrag, openDragForm, 
  removeDraggableEvents, setOpenDragForm, updateExistingEvent }) {

  const queryClient = useQueryClient();
 
  const handleReplace = () => {
    if (eventInfo) {
      updateExistingEvent(eventInfo, {
        onSuccess: () => {
          queryClient.invalidateQueries('events');
        }
      })
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
    updateExistingEvent({...oldEventDrag, classNames: 'duplicate',
    startEditable: !oldEventDrag?.extendedProps?.mandatory,
    durationEditable: !oldEventDrag?.extendedProps?.mandatory,
    editable: !oldEventDrag?.extendedProps?.mandatory}, {
      onSuccess: () => {
        queryClient.invalidateQueries('events')
      }
    });
    setOpenDragForm(false)
  }

  const handleYes = () => {
    if (eventInfo) {
      addNewEvent({
        ...eventInfo,
        classNames: 'past',
        id: eventInfo.id + 'duplicate'
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries('events')
        }
      })
    }
    if (oldEventDrag?.classNames?.includes('waiting-list')) {
      removeDraggableEvents.mutate(oldEventDrag.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })
    }
    updateExistingEvent({...oldEventDrag,
      classNames: 'duplicate',
      startEditable: !oldEventDrag?.extendedProps?.mandatory,
      durationEditable: !oldEventDrag?.extendedProps?.mandatory,
      editable: !oldEventDrag?.extendedProps?.mandatory,
    }, {
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
            <Button onClick={handleYes} sx={{ mt: 2 }}>
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